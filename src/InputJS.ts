// InputJS.ts
// UnityのInputクラス風のAPIでキーボード・マウス入力を管理するシングルトン

export type MousePosition = { x: number; y: number };

type KeyEventHandler = (key?: string) => void;
type MouseEventHandler = () => void;

interface KeyEventMap {
    [event: string]: KeyEventHandler[];
}
interface MouseEventMap {
    [event: string]: MouseEventHandler[];
}

class InputJSClass {
    private static _instance: InputJSClass;

    private keyStates: Map<string, boolean> = new Map();
    private keyDownStates: Map<string, boolean> = new Map();
    private keyUpStates: Map<string, boolean> = new Map();

    private mouseButtonStates: boolean[] = [false, false, false];
    private mouseButtonDownStates: boolean[] = [false, false, false];
    private mouseButtonUpStates: boolean[] = [false, false, false];
    private _mousePosition: MousePosition = { x: 0, y: 0 };

    // イベントマップ
    private keyEventMap: KeyEventMap = {};
    private anyKeyPressedHandlers: KeyEventHandler[] = [];
    private anyKeyReleasedHandlers: KeyEventHandler[] = [];
    private mouseEventMap: MouseEventMap = {};

    private constructor() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        // 右クリックメニュー抑制
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    // --- Unity風イベントAPI ---
    /**
     * キー押下イベント登録（例: 'OnKeyWPressed'）
     */
    public on(event: string, handler: KeyEventHandler | MouseEventHandler): void {
        if (event === 'OnAnyKeyPressed') {
            this.anyKeyPressedHandlers.push(handler as KeyEventHandler);
        } else if (event === 'OnAnyKeyReleased') {
            this.anyKeyReleasedHandlers.push(handler as KeyEventHandler);
        } else if (event.startsWith('OnKey')) {
            if (!this.keyEventMap[event]) this.keyEventMap[event] = [];
            this.keyEventMap[event].push(handler as KeyEventHandler);
        } else if (event.startsWith('OnMouse')) {
            if (!this.mouseEventMap[event]) this.mouseEventMap[event] = [];
            this.mouseEventMap[event].push(handler as MouseEventHandler);
        }
    }
    /**
     * イベントリスナー解除
     */
    public off(event: string, handler: KeyEventHandler | MouseEventHandler): void {
        if (event === 'OnAnyKeyPressed') {
            this.anyKeyPressedHandlers = this.anyKeyPressedHandlers.filter(h => h !== handler);
        } else if (event === 'OnAnyKeyReleased') {
            this.anyKeyReleasedHandlers = this.anyKeyReleasedHandlers.filter(h => h !== handler);
        } else if (event.startsWith('OnKey')) {
            this.keyEventMap[event] = (this.keyEventMap[event] || []).filter(h => h !== handler);
        } else if (event.startsWith('OnMouse')) {
            this.mouseEventMap[event] = (this.mouseEventMap[event] || []).filter(h => h !== handler);
        }
    }

    // --- イベント発火 ---
    private fireKeyEvent(event: string, key?: string) {
        (this.keyEventMap[event] || []).forEach(fn => fn());
    }
    private fireMouseEvent(event: string) {
        (this.mouseEventMap[event] || []).forEach(fn => fn());
    }

    public static get instance(): InputJSClass {
        if (!this._instance) {
            this._instance = new InputJSClass();
        }
        return this._instance;
    }

    // キーボード
    public getKey(key: string): boolean {
        return !!this.keyStates.get(key);
    }
    public getKeyDown(key: string): boolean {
        return !!this.keyDownStates.get(key);
    }
    public getKeyUp(key: string): boolean {
        return !!this.keyUpStates.get(key);
    }

    // マウス
    public getMouseButton(button: number): boolean {
        return !!this.mouseButtonStates[button];
    }
    public getMouseButtonDown(button: number): boolean {
        return !!this.mouseButtonDownStates[button];
    }
    public getMouseButtonUp(button: number): boolean {
        return !!this.mouseButtonUpStates[button];
    }
    public get mousePosition(): MousePosition {
        return { ...this._mousePosition };
    }

    // マウス座標上の要素取得
    public getElementOnMouse(): Element | null {
        return document.elementFromPoint(this._mousePosition.x, this._mousePosition.y);
    }

    // フレーム先頭で呼ぶ
    public update(): void {
        this.keyDownStates.clear();
        this.keyUpStates.clear();
        this.mouseButtonDownStates = [false, false, false];
        this.mouseButtonUpStates = [false, false, false];
    }

    // イベントハンドラ
    // キー名をイベント用に変換
    private getEventKeyName(key: string): string {
        switch (key) {
            case ' ': return 'Space';
            case 'Escape': return 'Escape';
            case 'Enter': return 'Enter';
            case 'Tab': return 'Tab';
            case 'ArrowUp': return 'ArrowUp';
            case 'ArrowDown': return 'ArrowDown';
            case 'ArrowLeft': return 'ArrowLeft';
            case 'ArrowRight': return 'ArrowRight';
            default:
                if (key.length === 1) return key.toUpperCase();
                return key;
        }
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const eventKey = this.getEventKeyName(e.key);
        if (!this.keyStates.get(e.key)) {
            this.keyDownStates.set(e.key, true);
            // Unity風イベント名: OnKey{Key名}Pressed
            const eventName = `OnKey${eventKey}Pressed`;
            this.fireKeyEvent(eventName);
            // 全キー共通イベント
            this.anyKeyPressedHandlers.forEach(fn => fn(eventKey));
        }
        this.keyStates.set(e.key, true);
    };
    private onKeyUp = (e: KeyboardEvent) => {
        const eventKey = this.getEventKeyName(e.key);
        this.keyStates.set(e.key, false);
        this.keyUpStates.set(e.key, true);
        // Unity風イベント名: OnKey{Key名}Released
        const eventName = `OnKey${eventKey}Released`;
        this.fireKeyEvent(eventName);
        // 全キー共通イベント
        this.anyKeyReleasedHandlers.forEach(fn => fn(eventKey));
    };
    private onMouseDown = (e: MouseEvent) => {
        if (!this.mouseButtonStates[e.button]) {
            this.mouseButtonDownStates[e.button] = true;
            // Unity風イベント名: OnMouse{Button名}Pressed
            const btn = e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : 'Right';
            const eventName = `OnMouse${btn}Pressed`;
            this.fireMouseEvent(eventName);
        }
        this.mouseButtonStates[e.button] = true;
    };
    private onMouseUp = (e: MouseEvent) => {
        this.mouseButtonStates[e.button] = false;
        this.mouseButtonUpStates[e.button] = true;
        // Unity風イベント名: OnMouse{Button名}Released
        const btn = e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : 'Right';
        const eventName = `OnMouse${btn}Released`;
        this.fireMouseEvent(eventName);
    };
    private onMouseMove = (e: MouseEvent) => {
        this._mousePosition.x = e.clientX;
        this._mousePosition.y = e.clientY;
    };
}

export const InputJS = InputJSClass.instance;
