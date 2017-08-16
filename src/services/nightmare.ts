

  export interface NightmareOptions extends BrowserWindowOptions {
    gotoTimeout ?: number;
    waitTimeout ?: number;
    paths ?: Paths;
    electronPath ?: string;
    switches ?: Switches;
    dock ?: boolean;
    openDevTools ?: boolean;
  }

  // https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
  export interface Paths {
    home ?: string;
    appData ?: string;
    userData ?: string;
    temp ?: string;
    exe ?: string;
    module ?: string;
    desktop ?: string;
    documents ?: string;
    downloads ?: string;
    music ?: string;
    pictures ?: string;
    videos ?: string;
  }

  // https://github.com/electron/electron/blob/master/docs/api/chrome-command-line-switches.md
  export interface Switches {
    'ignore-connection-limit' ?: string;
    'disable-http-cache' ?: boolean;
    'disable-http2' ?: boolean;
    'remote-debugging-port' ?: number;
    'js-flags' ?: string;
    'proxy-server' ?: string;
    'proxy-bypass-list' ?: string;
    'proxy-pac-url' ?: string;
    'no-proxy-server' ?: boolean;
    'host-rules' ?: string;
    'host-resolve-rules' ?: string;
    'auth-server-whitelist' ?: string;
    'auth-negotiate-delegate-whitelist' ?: string;
    'ignore-certificate-errors' ?: string;
    'ppapi-flash-path' ?: string;
    'ppapi-flash-version' ?: string;
    'log-net-log' ?: string;
    'ssl-version-fallback-min' ?: string;
    'cipher-suite-blacklist' ?: string;
    'disable-renderer-backgrounding' ?: string;
    'enable-logging' ?: boolean;
    'v' ?: string;
    'vmodule' ?: string;
  }

 export  interface BrowserWindowOptions extends Rectangle {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    useContentSize?: boolean;
    center?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
    movable?: boolean;
    minimizable?: boolean;
    maximizable?: boolean;
    closable?: boolean;
    alwaysOnTop?: boolean;
    fullscreen?: boolean;
    fullscreenable?: boolean;
    skipTaskbar?: boolean;
    kiosk?: boolean;
    title?: string;
    icon?: NativeImage | string;
    show?: boolean;
    frame?: boolean;
    acceptFirstMouse?: boolean;
    disableAutoHideCursor?: boolean;
    autoHideMenuBar?: boolean;
    enableLargerThanScreen?: boolean;
    backgroundColor?: string;
    hasShadow?: boolean;
    darkTheme?: boolean;
    transparent?: boolean;
    type?: BrowserWindowType;
    titleBarStyle?: 'default' | 'hidden' | 'hidden-inset';
    webPreferences?: WebPreferences;
  }

 export  type BrowserWindowType = BrowserWindowTypeLinux | BrowserWindowTypeMac;
  export type BrowserWindowTypeLinux = 'desktop' | 'dock' | 'toolbar' | 'splash' | 'notification';
 export  type BrowserWindowTypeMac = 'desktop' | 'textured';

export   interface Rectangle {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

export   interface WebPreferences {
    nodeIntegration?: boolean;
    preload?: string;
    session?: string;
    partition?: string;
    zoomFactor?: number;
    javascript?: boolean;
    webSecurity?: boolean;
    allowDisplayingInsecureContent?: boolean;
    allowRunningInsecureContent?: boolean;
    images?: boolean;
    textAreasAreResizable?: boolean;
    webgl?: boolean;
    webaudio?: boolean;
    plugins?: boolean;
    experimentalFeatures?: boolean;
    experimentalCanvasFeatures?: boolean;
    directWrite?: boolean;
    blinkFeatures?: string;
    defaultFontFamily?: {
      standard?: string;
      serif?: string;
      sansSerif?: string;
      monospace?: string;
    };
    defaultFontSize?: number;
    defaultMonospaceFontSize?: number;
    minimumFontSize?: number;
    defaultEncoding?: string;
    backgroundThrottling?: boolean;
  }

 export  declare class NativeImage {
    static createEmpty(): NativeImage;
    static createFromPath(path: string): NativeImage;
    static createFromBuffer(buffer: Buffer, scaleFactor?: number): NativeImage;
    static createFromDataURL(dataURL: string): NativeImage;
    toPng(): Buffer;
    toJpeg(quality: number): Buffer;
    toDataURL(): string;
    getNativeHandle(): Buffer;
    isEmpty(): boolean;
    getSize(): Dimension;
    setTemplateImage(option: boolean): void;
    isTemplateImage(): boolean;
  }

 export  interface Dimension {
    width: number;
    height: number;
  }

 export  interface PrintToPDFOptions {
    marginsType?: number;
    pageSize?: 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';
    printBackground?: boolean;
    printSelectionOnly?: boolean;
    landscape?: boolean;
  }


export interface Nightmare {
  constructor(options?: NightmareOptions):Nightmare;
  engineVersions(): Nightmare;
  authentication(user: string, password: string): Nightmare;
  useragent(useragent: string): Nightmare;
  end(): Nightmare;
  goto(url: string, headers?: Object): Nightmare;
  back(): Nightmare;
  forward(): Nightmare;
  refresh(): Nightmare;
  click(selector: string): Nightmare;
  mousedown(selector: string): Nightmare;
  type(selector: string, text: string): Nightmare;
  insert(selector: string, text: string): Nightmare;
  check(selector: string): Nightmare;
  uncheck(selector: string): Nightmare;
  select(selector: string, option: string): Nightmare;
  scrollTo(top: number, left: number): Nightmare;
  viewport(width: number, height: number): Nightmare;
  inject(type: string, file: string): Nightmare;
  evaluate<T>(fn: (...values: T[]) => any, ...values: T[]): Nightmare;
  wait(ms: number): Nightmare;
  wait(selector: string): Nightmare;
  wait<T>(fn: (...values: T[]) => boolean, ...values: T[]): Nightmare;
  header(header: string, value: string): Nightmare;
  exists(selector: string): Nightmare;
  visible(selector: string): Nightmare;
  screenshot(path: string): Nightmare;
  html(path: string, saveType: 'HTMLOnly' | 'HTMLComplete' | 'MHTML'): Nightmare;
  pdf(path: string, options?: PrintToPDFOptions): Nightmare;
  title(): Nightmare;
  url(): Nightmare;
  use(plugin: (nightmare: Nightmare) => void): Nightmare;
  then<T>(fulfill?: (value: any) => T, reject?: (value: any) => T): Promise<T>;
  catch<T>(reject?: (error: any) => T): Promise<T>;
}

