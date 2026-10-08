//
//  MacroProvider.swift
//  FoodScane
//
//  Created by Adil Rao on 10/2/2026.
//

import WidgetKit

struct MacroProvider: TimelineProvider {

    func placeholder(in context: Context) -> MacroEntry {
        MacroEntry(
            date: Date(),
            macrosData: [Macros(title: "Test", total: 345, tracked: 128, color: "#fcfc2c", width: 0.65)]
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (MacroEntry) -> ()) {
        completion(
            MacroEntry(date: Date(), macrosData: loadMacrosData())
        )
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MacroEntry>) -> ()) {
        let entry = MacroEntry(date: Date(), macrosData: loadMacrosData())
        let timeline = Timeline(
            entries: [entry],
            policy: .after(Date().addingTimeInterval(60 * 15))
        )
        completion(timeline)
    }

  // MARK: - App Group Reader
    private func loadMacrosData() -> [Macros] {
        let defaults = UserDefaults(suiteName: "group.com.nutrisync.ios")
        
        // Read the array from UserDefaults
        guard let array = defaults?.array(forKey: "MACROS_DATA") as? [[String: Any]] else {
            return []
        }
        
        // Map each dictionary to Macros struct
        let macrosArray: [Macros] = array.compactMap { dict in
            guard
                let title = dict["title"] as? String,
                let total = (dict["total"] as? NSNumber)?.intValue ?? Int((dict["total"] as? String) ?? "0"),
                let tracked = (dict["tracked"] as? NSNumber)?.intValue ?? Int((dict["tracked"] as? String) ?? "0"),
                let color = dict["color"] as? String,
                let width = (dict["width"] as? NSNumber)?.doubleValue ?? Double((dict["width"] as? String) ?? "0")
            else {
                return nil
            }
            
            return Macros(
                title: title,
                total: total,
                tracked: tracked,
                color: color,
                width: width
            )
        }
        
        return macrosArray
    }

}
