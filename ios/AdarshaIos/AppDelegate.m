/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"

#import "HexColors.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

#if TARGET_IPHONE_SIMULATOR
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"AdarshaIos"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // https://github.com/facebook/react-native/issues/3083
  // TabBarIOS.Item active / inactive color
  // http://stackoverflow.com/questions/26551458/change-tintcolor-of-unselected-uitabbarcontroller-item-title-and-background-imag
  // http://jslim.net/blog/2014/05/05/ios-customize-uitabbar-appearance/

  [UITabBarItem.appearance setTitleTextAttributes:
                @{NSForegroundColorAttributeName : [UIColor hx_colorWithHexString:@"FFFFFF" alpha: 0.7]}
                                         forState:UIControlStateNormal];

  [UITabBarItem.appearance setTitleTextAttributes:
                @{NSForegroundColorAttributeName : [UIColor hx_colorWithHexString:@"FFFFFF"]}
                                         forState:UIControlStateSelected];

  return YES;
}

@end
