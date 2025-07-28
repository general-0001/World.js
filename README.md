# World.js

World.js is a modern, extensible, and modular Entity Component System (ECS) library for high-performance applications.

Written in TypeScript, it provides a minimal core and a modular ecosystem of optional packages.

---

## Concept

The core philosophy of World.js is to completely separate **state and logic** from **rendering and other features**.

This allows you to reuse your application's core logic while freely combining different rendering targets (DOM, Canvas, 3D) and integrating various external services.

---

## Key Features

* **Modularity 🧩**
    The core engine is dependency-free. Renderers, physics, and other utilities are provided as independent, optional packages. You only install what you need.

* **Extensibility 🛠️**
    A minimal core and an event-driven design make it easy to add new features and plugins.

* **Performance 🚀**
    Built on a data-oriented design, World.js is ideal for complex simulations and real-time applications where performance is critical. It's highly compatible with parallel processing to maximize hardware potential.

* **Separation of Concerns 📐**
    It cleanly separates application state and logic (the `World`) from its visual representation (the `Renderer`). This improves code reusability and makes debugging and testing easier.

---

## Architecture

World.js consists of a suite of interoperable packages, not a single monolithic library.

* **`@worldjs/core`**:
    The platform-agnostic core ECS engine and the heart of the ecosystem.

* **`@worldjs/dom-renderer`**:
    A renderer for displaying the ECS state as HTML DOM elements.

* **`@worldjs/canvas-renderer`**:
    A renderer for drawing the ECS state as 2D graphics on an HTML Canvas.

* **`@worldjs/physics`** (Future Vision):
    A utility package for physics calculations.

* **`@worldjs/supabase-sync`** (Future Vision):
    A utility package for real-time synchronization with a Supabase database.

---

## Target Use Cases

* Browser-based games
* Physics simulations, scientific or financial modeling
* Complex, interactive web applications like Figma
* Data visualization tools
* High-throughput server-side logic

---
<br>

# World.js (日本語)

World.jsは、高いパフォーマンスが求められるアプリケーション向けの、モダンで拡張性の高いEntity Component System (ECS) ライブラリです。

TypeScriptで書かれており、最小限のコアと選択可能なパッケージで構成されるモジュール式のエコシステムを提供します。

---

## コンセプト

World.jsの核となる思想は、**「状態とロジック」を「描画やその他の機能」から完全に分離する**ことです。

これにより、アプリケーションのコアロジックを再利用しながら、描画ターゲット（DOM, Canvas, 3D）や外部サービス連携などを自由に組み合わせることが可能になります。

---

## 主な特徴

* **モジュール性 🧩**
    コアエンジンは特定の機能に依存しません。レンダラー、物理演算、外部サービス連携といった機能は、すべて独立したオプションパッケージとして提供されます。

* **拡張性 🛠️**
    シンプルなコアとイベント駆動の設計により、新しい機能やプラグインを簡単に追加できます。

* **パフォーマンス 🚀**
    データ指向設計に基づいているため、無数のオブジェクトが相互作用する複雑なシミュレーションやリアルタイムアプリケーションに最適です。ハードウェアの性能を最大限に引き出す並列処理とも非常に相性が良いです。

* **関心の分離 📐**
    アプリケーションの状態とロジック（`World`）と、その視覚的な表現（`Renderer`）を明確に分離します。これにより、コードの再利用性が高まり、デバッグやテストが容易になります。

---

## アーキテクチャ

World.jsは、単一のライブラリではなく、連携して動作するパッケージ群で構成されます。

* **`@worldjs/core`**:
    エコシステムの中心となる、プラットフォーム非依存のコアECSエンジン。

* **`@worldjs/dom-renderer`**:
    ECSの状態をHTML DOMに描画するためのレンダラー。

* **`@worldjs/canvas-renderer`**:
    ECSの状態をHTML Canvasに2Dグラフィックスとして描画するためのレンダラー。

* **`@worldjs/physics`** (将来構想):
    物理演算機能を提供するユーティリティパッケージ。

* **`@worldjs/supabase-sync`** (将来構想):
    Supabaseデータベースとのリアルタイム同期機能を提供する連携パッケージ。

---

## 対象となるユースケース

* ブラウザベースのゲーム
* 物理シミュレーションや科学的・金融的モデリング
* Figmaのような複雑でインタラクティブなWebアプリケーション
* データ可視化ツール
* 高いスループットが求められるサーバーサイドのロジック
