# InputJS ライブラリ仕様書

## 概要
- Webページ上でのキーボードおよびマウス入力を、Unityの`Input`クラス風のAPIで管理するJavaScriptライブラリ。
- シングルトンパターンで設計し、どこからでも同じ入力状態を参照可能。

## 主な機能
1. キーボード入力の取得
   - `InputJS.getKey(key: string): boolean`
     指定したキーが現在押されているかを返す。
   - `InputJS.getKeyDown(key: string): boolean`
     指定したキーがこのフレームで押されたかを返す。
   - `InputJS.getKeyUp(key: string): boolean`
     指定したキーがこのフレームで離されたかを返す。

2. マウス入力の取得
   - `InputJS.getMouseButton(button: number): boolean`
     指定したマウスボタン（0:左, 1:中, 2:右）が現在押されているかを返す。
   - `InputJS.getMouseButtonDown(button: number): boolean`
     指定したマウスボタンがこのフレームで押されたかを返す。
   - `InputJS.getMouseButtonUp(button: number): boolean`
     指定したマウスボタンがこのフレームで離されたかを返す。
   - `InputJS.mousePosition: { x: number, y: number }`
     現在のマウス座標を返す。

3. 更新処理
   - `InputJS.update(): void`
     各フレームの先頭で呼び出し、`getKeyDown`や`getKeyUp`などの状態をリセットする。

4. マウス座標上の要素取得
   - `InputJS.getElementOnMouse(): Element | null`
     現在のマウス座標上に存在する最前面のDOM要素を返す。
     取得できない場合は`null`を返す。

## 補足仕様
- イベントリスナーは自動で登録・解除される。
- サポートするキーは標準的なKeyboardEventの`key`値。
- マウス座標は`clientX`/`clientY`基準。
- 必要に応じてタッチ入力やホイール入力も拡張可能。
