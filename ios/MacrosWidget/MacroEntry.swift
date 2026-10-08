//
//  MacrosEntry.swift
//  FoodScane
//
//  Created by Adil Rao on 10/2/2026.
//

import WidgetKit

struct Macros: Identifiable {
    let id = UUID()
    let title: String
    let total: Int
    let tracked: Int
    let color: String
    let width: Double
}

struct MacroEntry: TimelineEntry {
    let date: Date
    let macrosData: [Macros]
}
