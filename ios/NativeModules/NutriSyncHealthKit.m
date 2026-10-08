//
//  NutriSyncHealthKit.m
//  FoodScane
//
//  Created by Adil Rao on 9/3/2026.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NutriSyncHealthKit, NSObject)

RCT_EXTERN_METHOD(isHealthAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getWeight:(NSString *)day
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSleep:(NSString *)day
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Activity sync is on hold — the Swift implementation is commented out, so
// this must stay commented too or the bridge would export a missing method.
// RCT_EXTERN_METHOD(getActivity:(NSString *)day
//                   resolve:(RCTPromiseResolveBlock)resolve
//                   rejecter:(RCTPromiseRejectBlock)reject)

@end
