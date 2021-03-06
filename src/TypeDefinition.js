/* @flow */

import React from 'react';

import {
  Animated,
} from 'react-native';

import type {
  HeaderMode,
  HeaderProps,
} from './views/Header';

/**
 * NavigationState is a tree of routes for a single navigator, where each child
 * route may either be a NavigationScreenRoute or a NavigationRouterRoute.
 * NavigationScreenRoute represents a leaf screen, while the
 * NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be the
 * state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */
export type NavigationState = {
  /**
   * Index refers to the active child route in the routes array.
   */
  index: number,
  routes: Array<NavigationRoute>,
};

export interface NavigationRoute {
  /**
   * React's key used by some navigators. No need to specify these manually,
   * they will be defined by the router.
   */
  key: string,
  /**
   * For example 'Home'.
   * This is used as a key in a route config when creating a navigator.
   */
  routeName: string,
  /**
   * Path is an advanced feature used for deep linking and on the web.
   */
  path?: string,
  /**
   * Params passed to this route when navigating to it,
   * e.g. `{ car_id: 123 }` in a route that displays a car.
   */
  params?: NavigationParams,
}

export type NavigationRouter = {
  /**
   * The reducer that outputs the new navigation state for a given action, with
   * an optional previous state. When the action is considered handled but the
   * state is unchanged, the output state is null.
   */
  getStateForAction: (
    action: NavigationAction,
    lastState: ?NavigationState,
  ) => ?NavigationState,

  /**
   * Maps a URI-like string to an action. This can be mapped to a state
   * using `getStateForAction`.
   */
  getActionForPathAndParams: (path: string, params?: NavigationParams) => ?NavigationAction,

  getPathAndParamsForState: (state: NavigationState) => {path: string, params?: NavigationParams},

  getComponentForRouteName: (routeName: string) => NavigationComponent,

  getComponentForState: (state: NavigationState) => NavigationComponent,

  /**
   * Gets the screen config for a given navigation screen prop.
   *
   * For example, we could get the config for a 'Foo' screen when the
   * `navigation.state` is:
   *
   *  {routeName: 'Foo', key: '123'}
   */
  getScreenConfig: (
    navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
    optionName: string,
  ) => ?any, // todo, fix this any type to become a key of NavigationScreenConfig
};

export type NavigationScreenOption<T> =
  | (navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
    config: NavigationScreenOptionConfig,
    router?: NavigationRouter) => T
  | T;

export type Style = Object | number | false | void;

export type HeaderConfig = {
  /**
   * Title string used by the navigation bar, or a custom component
   */
  title?: string | React.Element<*>;

  /**
   * Whether the navigation bar is visible.
   */
  visible?: boolean;

  /**
   * Renders a custom right component
   */
  right?: React.Element<*>,

  /**
   * Renders a custom left component
   */
  left?: React.Element<*>,

  /**
   * Style passed into navigation bar container
   */
  style?: Style,

  /**
   * Style passed into navigation bar title
   */
  titleStyle?: Style,

  // // Style of title text
  // titleTextStyle?: $NavigationThunk<Object>,
  // // Tint color of navigation bar contents
  // tintColor?: $NavigationThunk<string>,
  // // Navigation bar height
  // height?: $NavigationThunk<number>,
  // // Navigation bar translucentcy
  // translucent?: $NavigationThunk<boolean>,
  // // Renders a custom left component
  // renderLeft?: React.Element<*> |
  //   (navigation: NavigationProp<*>, canGoBack: boolean) => React.Element<*>,
  // // Renders a custom navigation bar background
  // renderBackground?: $NavigationThunk<React.Element<*>>,
};

export type TabBarConfig = {
  /**
   * Icon used by the tab bar.
   */
  icon?: (options: { tintColor: string, focused: boolean }) => ?React.Element<*>;
  /**
   * Label text used by the tab bar.
   */
  label?: string | React.Element<*>;
};

export type DrawerConfig = {
  /**
   * Icon used by the drawer.
   */
  icon?: (options: { tintColor: string, focused: boolean }) => ?React.Element<*>;
  /**
   * Label text used by the drawer.
   */
  label?: string;
};

export type NavigationScreenOptions = {
  /**
   * Title is rendered by certain navigators, e.g. the tab navigator,
   * or on web as the title of the browser tab.
   */
  title?: NavigationScreenOption<string>;
  /**
   * Options passed to the navigation bar for this screen.
   */
  header?: NavigationScreenOption<HeaderConfig>;
  /**
   * Options passed to the tab bar for this screen.
   */
  tabBar?: NavigationScreenOption<TabBarConfig>;
  /**
   * Options passed to the drawer for this screen.
   */
  drawer?: NavigationScreenOption<DrawerConfig>;
};

export type NavigationScreenConfig = {
  title?: string,
  header?: HeaderConfig,
  tabBar?: TabBarConfig,
  drawer?: DrawerConfig;
};

export type NavigationComponent = NavigationScreenComponent<*> | NavigationNavigator<*>;

export type NavigationScreenComponent<T> = ReactClass<T> & {
  navigationOptions?: NavigationScreenOptions,
};

export type NavigationNavigator<T> = ReactClass<T> & {
  router?: NavigationRouter,
  navigationOptions?: NavigationScreenOptions,
};

export type NavigationParams = {
  [key: string]: string,
};

export type NavigationNavigateAction = {
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params?: NavigationParams,

  // The action to run inside the sub-router
  action?: NavigationNavigateAction,
};

export type NavigationBackAction = {
  type: 'Navigation/BACK',
  key?: ?string,
};

export type NavigationSetParamsAction = {
  type: 'Navigation/SET_PARAMS',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params?: NavigationParams,
};

export type NavigationInitAction = {
  type: 'Navigation/INIT',
};

export type NavigationResetAction = {
  type: 'Navigation/RESET',
  index: number,
  actions: Array<NavigationNavigateAction>,
};

export type NavigationUriAction = {
  type: 'Navigation/URI',
  uri: string,
};

export type NavigationContainerOptions = {
  // This is used to extract the path from the URI passed to the app for a deep link
  URIPrefix?: string,
};

export type NavigationContainerConfig = {
  containerOptions?: NavigationContainerOptions,
};

export type NavigationStackViewConfig = {
  mode?: 'card' | 'modal',
  headerMode?: HeaderMode,
  headerComponent?: ReactClass<HeaderProps>,
  cardStyle?: Style,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void
};

export type NavigationStackRouterConfig = {
  initialRouteName?: string,
  initialRouteParams?: NavigationParams,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenOptions,
};

export type NavigationStackAction =
  | NavigationInitAction
  | NavigationNavigateAction
  | NavigationBackAction
  | NavigationSetParamsAction
  | NavigationResetAction;

export type NavigationTabAction =
  | NavigationInitAction
  | NavigationNavigateAction
  | NavigationBackAction;

export type NavigationAction =
  | NavigationInitAction
  | NavigationStackAction
  | NavigationTabAction;

export type NavigationScreenRouteConfig = {
  /** React component or navigator to render for this route */
  screen: NavigationScreenComponent<*> | NavigationNavigator<*>,
  navigationOptions?: NavigationScreenOptions,
  path?: string,
};

export type NavigationLazyScreenRouteConfig = {
  /** React component or navigator to lazily require and render for this route */
  getScreen: () => (NavigationScreenComponent<*> | NavigationNavigator<*>),
  navigationOptions?: NavigationScreenOptions,
  path?: string,
};

export type NavigationRouteConfig =
  | NavigationScreenRouteConfig
  | NavigationLazyScreenRouteConfig;

export type NavigationPathsConfig = {
  [routeName: string]: string,
};

export type NavigationTabRouterConfig = {
  initialRouteName?: string,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenOptions,
  order?: Array<string>, // todo: type these as the real route names rather than 'string'

  // Does the back button cause the router to switch to the initial tab
  backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
};

export type NavigationRouteConfigMap = {
  [routeName: string]: NavigationRouteConfig,
};

export type NavigationDispatch<A> = (action: A) => boolean;

export type NavigationProp<S, A> = {
  state: S,
  dispatch: NavigationDispatch<A>,
};

export type NavigationScreenProp<S, A> = {
  state: S,
  dispatch: NavigationDispatch<A>,
  goBack: (routeKey?: string) => boolean,
  navigate: (routeName: string, params?: NavigationParams, action?: NavigationAction) => boolean,
  setParams: (newParams: NavigationParams) => boolean,
};

export type NavigationNavigatorProps = {
  navigation: NavigationProp<NavigationState, NavigationAction>,
};

/**
 * Gestures, Animations, and Interpolators
 */

export type NavigationAnimatedValue = Animated.Value;

export type NavigationGestureDirection = 'horizontal' | 'vertical';

export type NavigationLayout = {
  height: NavigationAnimatedValue,
  initHeight: number,
  initWidth: number,
  isMeasured: boolean,
  width: NavigationAnimatedValue,
};

export type NavigationScene = {
  index: number,
  isActive: boolean,
  isStale: boolean,
  key: string,
  route: NavigationRoute,
};

export type NavigationTransitionProps = {
  // The layout of the transitioner of the scenes.
  layout: NavigationLayout,

  // The navigation state of the transitioner.
  navigationState: NavigationState,

  // The progressive index of the transitioner's navigation state.
  position: NavigationAnimatedValue,

  // The value that represents the progress of the transition when navigation
  // state changes from one to another. Its numberic value will range from 0
  // to 1.
  //  progress.__getAnimatedValue() < 1 : transtion is happening.
  //  progress.__getAnimatedValue() == 1 : transtion completes.
  progress: NavigationAnimatedValue,

  // All the scenes of the transitioner.
  scenes: Array<NavigationScene>,

  // The active scene, corresponding to the route at
  // `navigationState.routes[navigationState.index]`. When rendering
  // NavigationSceneRendererPropsIndex, the scene does not refer to the active
  // scene, but instead the scene that is being rendered. The index always
  // is the index of the scene
  scene: NavigationScene,
  index: number,
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,

  // The gesture distance for `horizontal` and `vertical` transitions
  gestureResponseDistance?: ?number,
};

// The scene renderer props are nearly identical to the props used for rendering
// a transition. The exception is that the passed scene is not the active scene
// but is instead the scene that the renderer should render content for.
export type NavigationSceneRendererProps = NavigationTransitionProps;

export type NavigationPanHandlers = {
  onMoveShouldSetResponder: () => void,
  onMoveShouldSetResponderCapture: () => void,
  onResponderEnd: () => void,
  onResponderGrant: () => void,
  onResponderMove: () => void,
  onResponderReject: () => void,
  onResponderRelease: () => void,
  onResponderStart: () => void,
  onResponderTerminate: () => void,
  onResponderTerminationRequest: () => void,
  onStartShouldSetResponder: () => void,
  onStartShouldSetResponderCapture: () => void,
};

export type NavigationTransitionSpec = {
  duration?: number,
  // An easing function from `Easing`.
  easing?: () => any,
  // A timing function such as `Animated.timing`.
  timing?: (value: NavigationAnimatedValue, config: any) => any,
};

export type NavigationAnimationSetter = (
  position: NavigationAnimatedValue,
  newState: NavigationState,
  lastState: NavigationState,
) => void;

export type NavigationSceneRenderer = (
  props: NavigationSceneRendererProps,
) => ?React.Element<*>;

export type NavigationStyleInterpolator = (
  props: NavigationSceneRendererProps,
) => Object;

export type ContextWithNavigation = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
};
