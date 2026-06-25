package com.globalchain.ui.screens.visualization

import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import com.globalchain.data.models.Supplier
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.viewmodel.SupplierViewModel


// ── 3D Globe Screen ──────────────────────────────────────────────────────────

@Composable
fun VisualGlobeScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val loading by vm.loading.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF020617))
    ) {
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
            Text("3D SUPPLY CHAIN GLOBE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text("Interactive global supplier visualization", color = Color(0xFF64748B), fontSize = 11.sp)
        }

        when {
            loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFF3B82F6))
            }
            suppliers.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                EmptyDataPlaceholder("Upload your supplier data to see them plotted on the 3D globe")
            }
            else -> GlobeWebView(suppliers = suppliers)
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GlobeWebView(suppliers: List<Supplier>) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var webViewRef by remember { mutableStateOf<WebView?>(null) }
    var hasError by remember { mutableStateOf(false) }

    // HTML setup is static now
    val html = remember { buildGlobeHtml() }

    // Push data whenever suppliers change
    LaunchedEffect(suppliers, webViewRef) {
        if (webViewRef != null && suppliers.isNotEmpty()) {
            val pointsJson = generatePointsJson(suppliers)
            val arcsJson = generateArcsJson(suppliers)
            val js = "updateGlobeData([$pointsJson], [$arcsJson]);"
            webViewRef?.evaluateJavascript(js, null)
        }
    }

    if (hasError) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Public, null, tint = Color(0xFF3B82F6).copy(0.4f), modifier = Modifier.size(48.dp))
                Spacer(modifier = Modifier.height(12.dp))
                Text("Globe requires an internet connection", color = Color(0xFF64748B), fontSize = 12.sp)
                Text("${suppliers.size} suppliers loaded", color = Color(0xFF3B82F6), fontSize = 11.sp)
            }
        }
        return
    }

    AndroidView(
        factory = { ctx ->
            try {
                WebView(ctx).apply {
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        allowContentAccess = true
                        allowFileAccess = true
                        loadWithOverviewMode = true
                        useWideViewPort = true
                        builtInZoomControls = false
                        displayZoomControls = false
                        @Suppress("DEPRECATION")
                        mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    }
                    setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null)
                    setBackgroundColor(android.graphics.Color.parseColor("#020617"))
                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            if (suppliers.isNotEmpty()) {
                                val pointsJson = generatePointsJson(suppliers)
                                val arcsJson = generateArcsJson(suppliers)
                                evaluateJavascript("updateGlobeData([$pointsJson], [$arcsJson]);", null)
                            }
                        }
                        override fun onReceivedError(
                            view: WebView?,
                            errorCode: Int,
                            description: String?,
                            failingUrl: String?
                        ) {
                            // Don't crash app
                        }
                    }
                    webViewRef = this
                }
            } catch (e: Exception) {
                hasError = true
                WebView(ctx)
            }
        },
        update = { webView ->
            if (webView.url == null) {
                try {
                    webView.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null)
                } catch (e: Exception) {
                    hasError = true
                }
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}

private fun generatePointsJson(suppliers: List<Supplier>): String {
    return suppliers.joinToString(",\n") { s ->
        val color = when (s.tierLevel) {
            1 -> "#EF4444"
            2 -> "#F59E0B"
            else -> "#10B981"
        }
        val size = if (s.isBackup) 0.3f else when (s.tierLevel) { 1 -> 0.6f; 2 -> 0.5f; else -> 0.4f }
        val label = s.name.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", "")
        val country = (s.country ?: s.region ?: "Unknown").replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", "")
        """{"lat":${s.lat},"lng":${s.lng},"size":$size,"color":"$color","label":"$label","tier":${s.tierLevel},"country":"$country","health":${s.healthScore.toInt()}}"""
    }
}

private fun generateArcsJson(suppliers: List<Supplier>): String {
    val arcs = mutableListOf<String>()
    suppliers.forEach { s ->
        if (!s.dependsOn.isNullOrBlank()) {
            val target = suppliers.find { it.name.equals(s.dependsOn, ignoreCase = true) }
            if (target != null) {
                val isDisrupted = s.healthScore < 70 || target.healthScore < 70
                val color = if (isDisrupted) "#EF4444" else "#FFFFFF"
                arcs.add("""{"startLat":${s.lat},"startLng":${s.lng},"endLat":${target.lat},"endLng":${target.lng},"color":"$color"}""")
            }
        }
    }
    return arcs.joinToString(",\n")
}

private fun buildGlobeHtml(): String {
    return """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #020617; overflow: hidden; font-family: 'Courier New', monospace; }
  #globe-container { width: 100vw; height: 100vh; }
  #tooltip {
    position: fixed; top: 12px; left: 12px; right: 12px;
    background: rgba(15,23,42,0.95);
    border: 1px solid rgba(59,130,246,0.4);
    border-radius: 12px; padding: 12px 16px;
    color: #fff; font-size: 12px; display: none;
    backdrop-filter: blur(8px);
  }
  #tooltip .name { color: #3B82F6; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
  #tooltip .meta { color: #94A3B8; font-size: 11px; }
  #legend {
    position: fixed; bottom: 16px; left: 16px;
    background: rgba(15,23,42,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 10px 14px;
    font-size: 10px; color: #94A3B8;
  }
  .legend-item { display: flex; align-items: center; margin-bottom: 4px; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
  #count {
    position: fixed; top: 12px; right: 12px;
    background: rgba(15,23,42,0.9);
    border: 1px solid rgba(59,130,246,0.3);
    border-radius: 8px; padding: 6px 12px;
    color: #3B82F6; font-size: 11px; font-weight: bold;
  }
</style>
</head>
<body>
<div id="globe-container"></div>
<div id="tooltip">
  <div class="name" id="tt-name">—</div>
  <div class="meta" id="tt-meta">—</div>
</div>
<div id="count">0 SUPPLIERS</div>
<div id="legend">
  <div class="legend-item"><div class="legend-dot" style="background:#EF4444"></div>Tier 1 (Critical)</div>
  <div class="legend-item"><div class="legend-dot" style="background:#F59E0B"></div>Tier 2 (Strategic)</div>
  <div class="legend-item"><div class="legend-dot" style="background:#10B981"></div>Tier 3 (Support)</div>
  <div class="legend-item"><div class="legend-dot" style="background:#FFFFFF"></div>Healthy Route</div>
  <div class="legend-item"><div class="legend-dot" style="background:#EF4444"></div>Disrupted Route</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/globe.gl@2.30.0/dist/globe.gl.min.js"></script>
<script>
const tooltip = document.getElementById('tooltip');
const ttName = document.getElementById('tt-name');
const ttMeta = document.getElementById('tt-meta');

const globe = Globe()(document.getElementById('globe-container'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .width(window.innerWidth)
  .height(window.innerHeight)
  .pointLat(d => d.lat)
  .pointLng(d => d.lng)
  .pointColor(d => d.color)
  .pointAltitude(d => d.size * 0.05)
  .pointRadius(d => d.size)
  .pointLabel(d => '')
  .onPointClick(d => {
    ttName.textContent = d.label;
    ttMeta.textContent = 'Tier ' + d.tier + ' • ' + d.country + ' • Health: ' + d.health + '%';
    tooltip.style.display = 'block';
    setTimeout(() => { tooltip.style.display = 'none'; }, 4000);
  })
  .arcColor('color')
  .arcDashLength(0.4)
  .arcDashGap(0.2)
  .arcDashAnimateTime(1500)
  .arcStroke(1.5)
  .arcAltitudeAutoScale(0.25)
  .atmosphereColor('#3B82F6')
  .atmosphereAltitude(0.25);

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;
globe.controls().enableZoom = true;

window.addEventListener('resize', () => {
  globe.width(window.innerWidth).height(window.innerHeight);
});

// Exposed function to update data dynamically from Kotlin
window.updateGlobeData = function(points, arcs) {
  document.getElementById('count').textContent = points.length + ' SUPPLIERS';
  globe.pointsData(points);
  globe.arcsData(arcs);
};
</script>
</body>
</html>
""".trimIndent()
}

// ── Other Visualization Screens ───────────────────────────────────────────────

@Composable
fun VisualDensityScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("SUPPLIER DENSITY MAP", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Global heat map of supplier concentration", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))
        if (suppliers.isEmpty()) EmptyDataPlaceholder("Upload supplier data to generate density map")
        else {
            val byRegion = suppliers.groupBy { it.region ?: "Unknown" }.entries.sortedByDescending { it.value.size }
            byRegion.forEach { (region, list) ->
                val pct = list.size.toFloat() / suppliers.size
                val color = when {
                    pct > 0.3f -> Color(0xFFEF4444)
                    pct > 0.15f -> Color(0xFFF59E0B)
                    else -> Color(0xFF10B981)
                }
                Column(modifier = Modifier.padding(vertical = 6.dp)) {
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Text(region, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("${list.size} suppliers", color = color, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Box(modifier = Modifier.fillMaxWidth().height(6.dp).background(Color.White.copy(0.05f), androidx.compose.foundation.shape.RoundedCornerShape(3.dp))) {
                        Box(modifier = Modifier.fillMaxWidth(pct).fillMaxHeight().background(color, androidx.compose.foundation.shape.RoundedCornerShape(3.dp)))
                    }
                }
            }
        }
    }
}

@Composable
fun VisualDisastersScreen() {
    VisualizationPlaceholder("DISASTERS OVERLAY", "Active global disaster zones — requires live disaster feed integration")
}

@Composable
fun VisualHeatmapsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("RISK HEATMAPS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Geographical risk and health heatmaps", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))
        if (suppliers.isEmpty()) EmptyDataPlaceholder("Upload supplier data to generate risk heatmap")
        else {
            val highRisk = suppliers.filter { it.riskScore > 70 }
            val medRisk = suppliers.filter { it.riskScore in 40.0..70.0 }
            val lowRisk = suppliers.filter { it.riskScore < 40 }
            listOf(
                Triple("Critical Risk (>70)", highRisk.size, Color(0xFFEF4444)),
                Triple("Medium Risk (40–70)", medRisk.size, Color(0xFFF59E0B)),
                Triple("Low Risk (<40)", lowRisk.size, Color(0xFF10B981))
            ).forEach { (label, count, color) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(12.dp).background(color, androidx.compose.foundation.shape.RoundedCornerShape(3.dp)))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(label, color = Color.Gray, fontSize = 12.sp, modifier = Modifier.weight(1f))
                    Text("$count", color = color, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun VisualHistoryScreen() {
    VisualizationPlaceholder("HISTORICAL MAP", "Time-lapse visualization of supply chain changes")
}

@Composable
fun VisualShippingScreen() {
    VisualizationPlaceholder("SHIPPING LANES", "Active maritime and aerial freight routes")
}

@Composable
fun VisualTrafficScreen() {
    VisualizationPlaceholder("TRAFFIC & CONGESTION", "Real-time port and route congestion")
}

@Composable
private fun VisualizationPlaceholder(title: String, subtitle: String) {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text(title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text(subtitle, color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))
        EmptyDataPlaceholder("This visualization module is coming soon")
    }
}
