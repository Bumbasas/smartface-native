import { ViewEvents } from "../view/view-event";

export const WebViewEvents = {
  BackButtonPressed: 'backButtonPressed',
  ChangedURL: 'changedURL',
  ConsoleMessage: 'consoleMessage',
  Error: 'error',
  Load: 'load',
  OpenNewWindow: 'openNewWindow',
  Show: 'show',
  ...ViewEvents
} as const;

export type WebViewEvents = ExtractValues<typeof WebViewEvents>
