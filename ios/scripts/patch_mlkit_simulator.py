#!/usr/bin/env python3
"""Strip device-only platform tags from MLKit static frameworks.

Google's MLKit pods ship fat static frameworks whose arm64 objects are
tagged LC_BUILD_VERSION platform=2 (iOS device). The same slice is used
for both device and simulator links, so on Apple Silicon simulators the
link fails with "building for 'iOS-simulator', but linking in object
file ... built for 'iOS'".

Removing the LC_BUILD_VERSION load command (via vtool) makes the objects
platform-agnostic — exactly how the other MLKit libraries already ship —
so they link for both device and simulator. Idempotent: frameworks with
no tagged objects are skipped. Run automatically from the Podfile's
post_install hook.
"""

import os
import shutil
import struct
import subprocess
import sys
import tempfile

PODS_ROOT = os.path.join(os.path.dirname(__file__), "..", "Pods")
FRAMEWORKS = [
    "MLImage",
    "MLKitBarcodeScanning",
    "MLKitCommon",
    "MLKitVision",
]


def run(*cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def has_device_tagged_objects(binary, arch):
    out = subprocess.run(
        ["otool", "-arch", arch, "-l", binary],
        check=True, capture_output=True, text=True,
    ).stdout
    return "platform 2" in out


def ar_members(path):
    """Yield (name, data) for each member of a BSD ar archive."""
    with open(path, "rb") as f:
        assert f.read(8) == b"!<arch>\n", "not an ar archive"
        while True:
            header = f.read(60)
            if len(header) < 60:
                return
            name = header[0:16].decode().rstrip()
            size = int(header[48:58].decode().strip())
            data = f.read(size)
            if size % 2:  # members are 2-byte aligned
                f.read(1)
            if name.startswith("#1/"):  # BSD extended name
                name_len = int(name[3:])
                name = data[:name_len].rstrip(b"\x00").decode()
                data = data[name_len:]
            yield name, data


def patch_slice(archive, workdir):
    """Extract members, strip LC_BUILD_VERSION, return rebuilt archive path."""
    objdir = os.path.join(workdir, "objects")
    os.mkdir(objdir)
    objs = []
    for i, (name, data) in enumerate(ar_members(archive)):
        if name in ("__.SYMDEF", "__.SYMDEF SORTED"):
            continue  # libtool regenerates the symbol table
        # index prefix keeps duplicate member names from clobbering
        path = os.path.join(objdir, "%05d_%s" % (i, os.path.basename(name)))
        with open(path, "wb") as f:
            f.write(data)
        if data[:4] in (b"\xcf\xfa\xed\xfe", b"\xce\xfa\xed\xfe"):
            run("vtool", "-remove-build-version", "ios",
                "-output", path, path)
        objs.append(path)
    rebuilt = os.path.join(workdir, "rebuilt.a")
    run("libtool", "-static", "-no_warning_for_no_symbols",
        "-o", rebuilt, *objs)
    return rebuilt


def patch_framework(name):
    binary = os.path.join(
        PODS_ROOT, name, "Frameworks", name + ".framework", name)
    if not os.path.exists(binary):
        return
    archs = subprocess.run(
        ["lipo", "-archs", binary],
        check=True, capture_output=True, text=True,
    ).stdout.split()
    to_patch = [a for a in archs if has_device_tagged_objects(binary, a)]
    if not to_patch:
        print("  %s: already platform-agnostic" % name)
        return
    with tempfile.TemporaryDirectory() as tmp:
        slices = []
        for arch in archs:
            thin = os.path.join(tmp, arch + ".a")
            run("lipo", binary, "-thin", arch, "-output", thin)
            if arch in to_patch:
                workdir = os.path.join(tmp, arch)
                os.mkdir(workdir)
                thin = patch_slice(thin, workdir)
            slices.append(thin)
        fat = os.path.join(tmp, "fat")
        run("lipo", "-create", *slices, "-output", fat)
        shutil.copyfile(fat, binary)
    print("  %s: stripped device tag from %s" % (name, ", ".join(to_patch)))


if __name__ == "__main__":
    print("Patching MLKit frameworks for simulator linking...")
    for fw in FRAMEWORKS:
        patch_framework(fw)
    sys.exit(0)
