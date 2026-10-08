//
//  NutriSyncHealthKit.swift
//  FoodScane
//
//  Created by Adil Rao on 9/3/2026.
//

import Foundation
import HealthKit
import React

@objc(NutriSyncHealthKit)
class NutriSyncHealthKit: NSObject {

  private let healthStore = HKHealthStore()

  // MARK: - Check HealthKit availability
  @objc
  func isHealthAvailable(_ resolve: RCTPromiseResolveBlock,
                         rejecter reject: RCTPromiseRejectBlock) {
    let available = HKHealthStore.isHealthDataAvailable()
    resolve(available)
  }

  // MARK: - Request HealthKit permissions
  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard HKHealthStore.isHealthDataAvailable() else {
      reject("not_available", "HealthKit is not available on this device", nil)
      return
    }

    // Only the types the statistics form reads. Steps and the three Apple ring
    // types stay commented out while activity sync is on hold, so the HealthKit
    // sheet never asks the user to share them.
    guard
      let weightType = HKObjectType.quantityType(forIdentifier: .bodyMass),
      let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)
      // let stepType = HKObjectType.quantityType(forIdentifier: .stepCount),
      // let moveType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned),
      // let exerciseType = HKObjectType.quantityType(forIdentifier: .appleExerciseTime),
      // let standType = HKObjectType.categoryType(forIdentifier: .appleStandHour)
    else {
      reject("type_error", "Required HealthKit types unavailable", nil)
      return
    }

    let readTypes: Set<HKObjectType> = [
      weightType, sleepType
      // , stepType, moveType, exerciseType, standType
    ]

    healthStore.requestAuthorization(toShare: nil, read: readTypes) { success, error in
      if let error = error {
        reject("auth_error", "HealthKit authorization failed", error)
        return
      }
      resolve(success)
    }
  }

  // MARK: - Helper: date predicate for today/yesterday
  //
  // `matchEndDate` picks which end of a sample has to land inside the day.
  // Weight is an instant, so its start date is the right anchor. Sleep is not:
  // a night that begins at 23:30 belongs to the following day's log, and
  // .strictStartDate would file it under the wrong day.
  private func predicateForDay(_ day: String, matchEndDate: Bool = false) -> NSPredicate? {
    let calendar = Calendar.current
    let now = Date()
    var startDate: Date
    var endDate: Date

    if day.lowercased() == "today" {
      startDate = calendar.startOfDay(for: now)
      endDate = calendar.date(byAdding: .day, value: 1, to: startDate)!
    } else if day.lowercased() == "yesterday" {
      let todayStart = calendar.startOfDay(for: now)
      startDate = calendar.date(byAdding: .day, value: -1, to: todayStart)!
      endDate = todayStart
    } else {
      return nil
    }

    let options: HKQueryOptions = matchEndDate ? .strictEndDate : .strictStartDate

    return HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: options)
  }

  // MARK: - Get latest weight (today or yesterday)
  @objc
  func getWeight(_ day: String,
                 resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let weightType = HKQuantityType.quantityType(forIdentifier: .bodyMass) else {
      reject("type_error", "BodyMass type unavailable", nil)
      return
    }

    guard let predicate = predicateForDay(day) else {
      reject("date_error", "Invalid day parameter", nil)
      return
    }

    let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)

    let query = HKSampleQuery(sampleType: weightType,
                              predicate: predicate,
                              limit: 1, // latest only
                              sortDescriptors: [sort]) { _, results, error in

      if let error = error {
        reject("weight_fetch_error", "Failed to fetch weight", error)
        return
      }

      guard let sample = results?.first as? HKQuantitySample else {
        resolve(nil) // no data
        return
      }

      let weight = sample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo))
      let data: [String: Any] = [
        "value": weight,
        "date": Int(sample.startDate.timeIntervalSince1970 * 1000)
      ]
      resolve(data)
    }

    healthStore.execute(query)
  }

  // MARK: - Get latest sleep (today or yesterday)
  @objc
  func getSleep(_ day: String,
                resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {

      guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
          reject("type_error", "SleepAnalysis type unavailable", nil)
          return
      }

      guard let predicate = predicateForDay(day, matchEndDate: true) else {
          reject("date_error", "Invalid day parameter", nil)
          return
      }

      let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)

      // Get all sleep samples for today/yesterday
      let query = HKSampleQuery(sampleType: sleepType,
                                predicate: predicate,
                                limit: HKObjectQueryNoLimit,
                                sortDescriptors: [sort]) { _, results, error in

          if let error = error {
              reject("sleep_fetch_error", "Failed to fetch sleep data", error)
              return
          }

          guard let samples = results as? [HKCategorySample], !samples.isEmpty else {
              resolve(nil) // no sleep data
              return
          }

          // Only include actual asleep samples (ignore "in bed" / awake).
          //
          // Matched by excluding the two non-asleep states rather than naming
          // each asleep one: since iOS 16 the Apple Watch writes stage samples
          // (asleepCore/Deep/REM = 3/4/5) instead of the old asleep = 1, but
          // those cases are iOS 16+ API and this target is 15.6. Excluding
          // inBed (0) and awake (2) covers every asleep value on both.
          let inBedValue = HKCategoryValueSleepAnalysis.inBed.rawValue
          let awakeValue = HKCategoryValueSleepAnalysis.awake.rawValue

          let asleepSamples = samples.filter {
              $0.value != inBedValue && $0.value != awakeValue
          }

          // Sum total sleep duration in seconds
          let totalSeconds = asleepSamples.reduce(0.0) { $0 + $1.endDate.timeIntervalSince($1.startDate) }

          // Convert to hours
          let hours = totalSeconds / 3600.0

          // Optional: get latest sample for start/end reference
          let latestSample = asleepSamples.max(by: { $0.startDate < $1.startDate })

          let data: [String: Any] = [
              "hours": hours,
              "startDate": latestSample != nil ? Int(latestSample!.startDate.timeIntervalSince1970 * 1000) as Any : NSNull(),
              "endDate": latestSample != nil ? Int(latestSample!.endDate.timeIntervalSince1970 * 1000) as Any : NSNull()
          ]
          resolve(data)
      }

      healthStore.execute(query)
  }

  // MARK: - Get activity totals (today or yesterday)
  //
  // Commented out while activity sync is on hold, together with its
  // RCT_EXTERN_METHOD entry in NutriSyncHealthKit.m and the read types in
  // requestAuthorization above. Restore all three together.
  //
  // Steps and the three Apple rings in one bridge call: each is a separate
  // HealthKit query, so running them together costs one round trip instead of
  // four. A metric with no samples resolves as 0 rather than failing the whole
  // read — a denied read is indistinguishable from an empty one in HealthKit,
  // and one missing ring must not void the others.
  /*
  @objc
  func getActivity(_ day: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let predicate = predicateForDay(day) else {
      reject("date_error", "Invalid day parameter", nil)
      return
    }

    var totals: [String: Any] = ["steps": 0, "move": 0, "exercise": 0, "stand": 0]

    let group = DispatchGroup()
    // HealthKit delivers every result on its own queue, so writes to `totals`
    // are funnelled through one serial queue.
    let totalsQueue = DispatchQueue(label: "com.nutrisync.healthkit.activity")

    // Statistics queries rather than sample queries: HealthKit sums the day for
    // us instead of us paging every sample the iPhone/Watch wrote.
    func sumQuantity(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit, key: String) {
      guard let quantityType = HKQuantityType.quantityType(forIdentifier: identifier) else {
        return
      }

      group.enter()

      let query = HKStatisticsQuery(quantityType: quantityType,
                                    quantitySamplePredicate: predicate,
                                    options: .cumulativeSum) { _, statistics, _ in
        let total = statistics?.sumQuantity()?.doubleValue(for: unit) ?? 0
        totalsQueue.sync { totals[key] = total }
        group.leave()
      }

      healthStore.execute(query)
    }

    sumQuantity(.stepCount, unit: HKUnit.count(), key: "steps")
    sumQuantity(.activeEnergyBurned, unit: HKUnit.kilocalorie(), key: "move")
    sumQuantity(.appleExerciseTime, unit: HKUnit.minute(), key: "exercise")

    // Stand is a category type, not a quantity: the ring counts the hours
    // holding at least one "stood" sample rather than summing a value.
    if let standType = HKObjectType.categoryType(forIdentifier: .appleStandHour) {
      group.enter()

      let query = HKSampleQuery(sampleType: standType,
                                predicate: predicate,
                                limit: HKObjectQueryNoLimit,
                                sortDescriptors: nil) { _, results, _ in
        let stoodHours = (results as? [HKCategorySample])?.filter {
          $0.value == HKCategoryValueAppleStandHour.stood.rawValue
        }.count ?? 0

        totalsQueue.sync { totals["stand"] = stoodHours }
        group.leave()
      }

      healthStore.execute(query)
    }

    group.notify(queue: .main) {
      resolve(totals)
    }
  }
  */

  // Required by React Native
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
