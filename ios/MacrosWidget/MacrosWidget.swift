//
//  MacrosWidget.swift
//  MacrosWidget
//
//  Created by Adil Rao on 10/2/2026.
//

import WidgetKit
import SwiftUI


// MARK: - Widget
struct MacrosWidget: Widget {
    let kind = "MacrosWidget"

    var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: MacroProvider(), content: {MacroWidgetView(entry: $0)})
        .configurationDisplayName("Macros Widget")
        .description("Shows calories and protein progress.")
    }
}

// MARK: - Preview
#Preview(as: .systemSmall) {
    MacrosWidget()
} timeline: {
    MacroEntry(
        date: .now,
        macrosData: [Macros(title: "Test", total: 345, tracked: 128, color: "#fcfc2c", width: 0.65)]
    )
}
