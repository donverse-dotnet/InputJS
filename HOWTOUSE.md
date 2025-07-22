# InputJS 利用方法（HOWTOUSE.md）

## 1. GitHub Packagesからのインストール

まず、GitHub Packagesのスコープ付きnpmレジストリを利用できるように、.npmrcに以下を追加してください。

```
@donverse-dotnet:registry=https://npm.pkg.github.com
```

次に、npmでインストールします。

```
npm install @donverse-dotnet/inputjs
```

## 2. モジュールのインポート

TypeScript/ESMの場合:
```js
import { InputJS } from '@donverse-dotnet/inputjs';
```

CDNや手動配置の場合:
```html
<script type="module">
  import { InputJS } from './out/InputJS.js';
  // ...
</script>
```

## 3. 基本的な使い方

```js
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

## 4. テスト

`test.html`をブラウザで開くと、各種入力イベントの動作を確認できます。

## 5. 注意事項
- GitHub Packagesからインストールする場合、`.npmrc`の設定とGitHub認証が必要です。
- 詳細は[GitHub公式ドキュメント](https://docs.github.com/ja/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)も参照してください。

---
> [!NOTE]
> このライブラリはMITライセンスで提供されています。
> MITライセンスのもと、商用・非商用問わず自由に利用・改変・再配布が可能ですが、
> 著作権表示およびライセンス文書の同梱が必要です。
> 詳しくはLICENSE.mdをご確認ください。
