// ノードとエッジのデータを定義します
// データは別ファイル（data.js）をhtml側で読み込み（本番はAjaxで更新）
var nodes = new vis.DataSet(nodesdata);
var edges = new vis.DataSet(edgesdata);

// ネットワーク図を表示するためのHTML要素を取得します
var container = document.getElementById('mynetwork');

// ネットワーク図のオプションを設定します
var options = {
    nodes: {
        shape: 'box',
        margin: 10,
        widthConstraint: {
            maximum: 100
        },
        font: {
            size: 12, // フォントサイズを設定
            color: '#fff' // フォントカラーを白に設定
        },
        borderWidth: 2, // ノードの境界線の幅を設定
        color: {
            border: '#222', // ノードの境界線の色を設定
            background: '#666' // ノードの背景色を設定
        }
    },
    edges: {
        width: 2, // エッジの幅を設定
        color: '#848484' // エッジの色を設定
    }
};

// データとオプションを使用してネットワーク図を作成します
var network = new vis.Network(container, { nodes: nodes, edges: edges }, options);


// ノードがクリックされたときのイベントリスナーを設定します
network.on('click', function (properties) {
    var nodeId = properties.nodes[0]; // クリックされたノードのIDを取得します
    var node = nodes.get(nodeId); // ノードの詳細情報を取得します
    var idElement = document.getElementById('idElement'); // IDを表示する要素を取得します
    idElement.innerText = "ID：" + node.id;
    var labelElement = document.getElementById('labelElement'); // ラベルを表示する要素を取得します
    labelElement.innerText = "ラベル：" + node.label;
    var customPropertyElement = document.getElementById('customPropertyElement'); // カスタムプロパティを表示する要素を取得します
    customPropertyElement.innerText = "内容：" + node.customProperty;

    // ノードがクリックされたら、そのノードを中心にネットワーク図を拡大する
    network.focus(nodeId, {
        scale: 1.5, // 拡大率を設定します
        animation: true // アニメーションを有効にします
    });

});


// URLから取得したidを保存する変数
var urlId = 0;

// ネットワーク図が描画された後に実行される処理
network.on("afterDrawing", function () {
    // URLからidを取得して、ノードをハイライトおよび拡大表示します
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');

    // 取得したidが前回のidと異なる場合のみ処理を実行
    if (id !== urlId) {
        // 取得したidを保存
        urlId = id;
        // ノードにフォーカスする関数を呼び出す
        focusNode(id);
    }
});


// ノードにフォーカスする関数
function focusNode(id) {
    if (id) {
        // ノードが存在するか確認
        var node = nodes.get(id);
        if (node) {
            // ノードをハイライト
            var nodeIds = [id];
            network.selectNodes(nodeIds);
            // ノードを中心にネットワーク図を拡大する
            network.focus(id, {
                scale: 1.5, // 拡大率を設定します
                animation: true // アニメーションを有効にします
            });

            // メタデータを表示
            var idElement = document.getElementById('idElement'); // IDを表示する要素を取得します
            idElement.innerText = "ID：" + node.id;
            var labelElement = document.getElementById('labelElement'); // ラベルを表示する要素を取得します
            labelElement.innerText = "ラベル：" + node.label;
            var customPropertyElement = document.getElementById('customPropertyElement'); // カスタムプロパティを表示する要素を取得します
            customPropertyElement.innerText = "内容：" + node.customProperty;

            // コンソールに出力
            console.log("ノード ID: " + id + " が中心に表示されました。");
        } else {
            // ノードが見つからない場合のメッセージを表示
            var idElement = document.getElementById('idElement'); // IDを表示する要素を取得します
            idElement.innerText = "ノード ID: " + id + " が見つかりません。";
            // コンソールに出力
            console.log("ノード ID: " + id + " が見つかりません。");
        }
    } else {
        // IDが指定されていない場合のメッセージをコンソールに出力
        console.log("IDが指定されていません。");
    }
}

