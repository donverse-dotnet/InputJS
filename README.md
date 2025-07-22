# InputJS

UnityのInputクラス風APIでWebページ上のキーボード・マウス入力を管理できるTypeScriptライブラリ

## 特徴
- `Input.GetKey`のようなAPIでキーボード・マウス入力を簡単に取得
- 任意のキー・マウスボタンの押下/離上イベントをUnity風のイベント名で購読可能
- 全てのキーの押下/離上を一括で検知するイベントも用意
- マウス座標やマウス下の要素も取得可能
- シングルトン設計

## インストール・ビルド
1. 必要に応じて依存パッケージをインストール
   ```sh
   npm install
   ```
2. TypeScriptビルド
   ```sh
   npx tsc
   ```
   `out/InputJS.js`が生成されます。

## 使い方
```js
import { InputJS } from './out/InputJS.js';

// キーの状態取得
if (InputJS.getKey('w')) { /* ... */ }
if (InputJS.getKeyDown('w')) { /* ... */ }
if (InputJS.getKeyUp('w')) { /* ... */ }

// マウスの状態取得
if (InputJS.getMouseButton(0)) { /* ... */ } // 左
if (InputJS.getMouseButtonDown(2)) { /* ... */ } // 右

// マウス座標
const pos = InputJS.mousePosition;

// マウス下の要素
const elem = InputJS.getElementOnMouse();

// Unity風イベント購読
InputJS.on('OnKeyWPressed', () => { /* ... */ });
InputJS.on('OnKeySpaceReleased', () => { /* ... */ });
InputJS.on('OnMouseLeftPressed', () => { /* ... */ });

// 全てのキーの押下/離上を検知
InputJS.on('OnAnyKeyPressed', (key) => { console.log(key + ' pressed'); });
InputJS.on('OnAnyKeyReleased', (key) => { console.log(key + ' released'); });

// フレーム先頭で呼ぶ（getKeyDown/getKeyUpのリセット）
InputJS.update();
```

## テスト
`test.html`をブラウザで開くと、各種入力イベントの動作を確認できます。

## ディレクトリ構成
```
InputJS/
├─ src/           # TypeScriptソース
│   └─ InputJS.ts
├─ out/           # ビルド出力
│   └─ InputJS.js
├─ test.html      # 動作テスト用HTML
├─ tsconfig.json
├─ package.json（任意）
├─ .gitignore
└─ README.md
```
