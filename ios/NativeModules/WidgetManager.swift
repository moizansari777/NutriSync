//
//  WidgetManager.swift
//  FoodScane
//
//  Created by Adil Rao on 10/2/2026.
//

import Foundation
import WidgetKit
import React

@objc(WidgetManager)
class WidgetManager: NSObject {

  @objc(updateWidget:)
  func updateWidget(_ data: NSArray) {
    let defaults = UserDefaults(suiteName: "group.com.nutrisync.ios")
    defaults?.setValue(data, forKey: "MACROS_DATA")

    WidgetCenter.shared.reloadAllTimelines()
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
