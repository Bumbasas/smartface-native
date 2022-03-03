export const PageEvents = {
  Hide: 'hide',
  Load: 'load',
  Show: 'show',
  OrientationChange: 'orientationChange',
  SafeAreaPaddingChange: 'safeAreaPaddingChange'
} as const;

export type PageEvents = ExtractValues<typeof PageEvents>;
