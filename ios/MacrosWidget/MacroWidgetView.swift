//
//  MacroWidgetView.swift
//  FoodScane
//
//  Created by Adil Rao on 10/2/2026.
//

import SwiftUI
import WidgetKit

struct MacroWidgetView: View {
  let entry: MacroProvider.Entry
  @Environment(\.widgetFamily) var widgetFamily
  
  var body: some View {
    switch widgetFamily {
    case .systemSmall:
      smallView
    case .systemMedium:
      mediumView
    case .systemLarge:
      largeView
    default:
      mediumView
    }
  }
}

struct MacroBarView: View {
  var macro: Macros
  
  var body: some View {
    ZStack(alignment: .leading){
      Rectangle()
        .fill(Color(.systemGray4))
        .frame(height: 5)
        .cornerRadius(6)
      GeometryReader { geo in
        Rectangle()
          .fill(macro.color == "red" ? Color.red : Color.green)
          .frame(width: geo.size.width * (macro.width/100), height: 5)
          .cornerRadius(5)
      }
      .frame(height: 5)
    }
  }
}

extension MacroWidgetView {
  var smallView: some View {
    return VStack(alignment: .leading, spacing: 2) {
      ForEach(Array(entry.macrosData.enumerated()), id: \.offset) { index, item in
        let macro = entry.macrosData[index]
        HStack(spacing:1){
          Text("\(macro.title):")
            .font(.footnote)
            .fontWeight(.regular)
          Spacer()
          Text("\(macro.tracked)/\(macro.total)")
            .font(.footnote)
            .fontWeight(.medium)
        }
      }
    }
    .containerBackground(for: .widget) {
      Color(.systemBackground)
    }
  }
}

extension MacroWidgetView {
  var largeView: some View {
    VStack(alignment: .leading, spacing: 20) {
      ForEach(entry.macrosData.indices, id: \.self) { index in
        let macro = entry.macrosData[index]
        VStack(spacing:2){
          HStack(alignment: .top, spacing: 20){
            Text("\(macro.title)")
              .font(.footnote)
              .fontWeight(.regular)
            Spacer()
            HStack{
              Text("\(macro.tracked)")
                .font(.subheadline)
                .fontWeight(.semibold)
              Text("/ \(macro.total)")
                .font(.subheadline)
                .fontWeight(.regular)
            }
          }
          MacroBarView(macro: macro)
        }
      }
    }
    .containerBackground(for: .widget) {
      Color(.systemBackground)
    }
  }
}

extension MacroWidgetView {
    var mediumView: some View {
        let columns = [
            GridItem(.flexible(), spacing: 8),
            GridItem(.flexible(), spacing: 8)
        ]

        return LazyVGrid(columns: columns, spacing: 8) {
            ForEach(Array(entry.macrosData.enumerated()), id: \.offset) { index, item in
                let macro = entry.macrosData[index]

                VStack(alignment: .leading, spacing: 3) {
                  HStack(spacing: 4) {
                    Text(macro.title)
                        .font(.footnote)
                        .fontWeight(.regular)

                    Spacer(minLength: 8)

                    Text("\(macro.tracked)")
                        .font(.footnote)
                        .fontWeight(.semibold)

                    Text("/\(macro.total)")
                        .font(.footnote)
                        .fontWeight(.regular)
                  }
                    MacroBarView(macro: macro)
                }
                .padding(4)
            }
        }
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }
}
