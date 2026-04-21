package expo.modules.overlay

import android.content.Context
import android.content.Intent
import android.graphics.*
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.*
import android.widget.*
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class OverlayModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ExpoOverlay"

    private var windowManager: WindowManager? = null
    private var overlayRoot: View? = null
    private var trackTitle = "No track loaded"
    private var trackArtist = ""
    private var isPlaying = false
    private var isExpanded = false

    private fun emit(action: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onOverlayAction", Arguments.createMap().apply { putString("action", action) })
    }

    @ReactMethod fun requestPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${reactContext.packageName}")
            ).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
            reactContext.startActivity(intent)
        }
    }

    @ReactMethod fun hasPermission(promise: Promise) {
        val allowed = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
            Settings.canDrawOverlays(reactContext) else true
        promise.resolve(allowed)
    }

    @ReactMethod fun showOverlay() {
        if (overlayRoot != null) return
        reactContext.currentActivity?.runOnUiThread { buildOverlay() }
    }

    @ReactMethod fun hideOverlay() {
        reactContext.currentActivity?.runOnUiThread {
            overlayRoot?.let { windowManager?.removeView(it) }
            overlayRoot = null
        }
    }

    @ReactMethod fun updateTrack(title: String, artist: String) {
        trackTitle = title; trackArtist = artist
        reactContext.currentActivity?.runOnUiThread { refreshTrackLabel() }
    }

    @ReactMethod fun setPlaying(playing: Boolean) {
        isPlaying = playing
        reactContext.currentActivity?.runOnUiThread { refreshPlayButton() }
    }

    // ── build the floating window ──────────────────────────────────────────

    private fun buildOverlay() {
        windowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.END
            x = 24; y = 120
        }

        val root = buildBubbleView()
        overlayRoot = root

        makeDraggable(root, params)
        windowManager!!.addView(root, params)
    }

    private fun buildBubbleView(): FrameLayout {
        val ctx = reactContext
        val root = FrameLayout(ctx)

        // ── collapsed bubble ───────────────────────────────────────────────
        val bubble = buildBubble(ctx)
        root.addView(bubble)

        // ── expanded panel ─────────────────────────────────────────────────
        val panel = buildPanel(ctx)
        panel.visibility = View.GONE
        root.addView(panel)

        bubble.setOnClickListener {
            isExpanded = !isExpanded
            bubble.visibility = if (isExpanded) View.GONE else View.VISIBLE
            panel.visibility = if (isExpanded) View.VISIBLE else View.GONE
        }

        return root
    }

    // ── collapsed bubble ──────────────────────────────────────────────────

    private fun buildBubble(ctx: Context): View {
        val size = dp(ctx, 56)
        val bubble = TextView(ctx).apply {
            width = size; height = size
            gravity = Gravity.CENTER
            text = "🎵"; textSize = 22f
            background = circleDrawable(Color.parseColor("#CC0a0a0a"), Color.parseColor("#b026ff"))
        }
        return bubble
    }

    // ── expanded panel ────────────────────────────────────────────────────

    private fun buildPanel(ctx: Context): LinearLayout {
        val panel = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            background = roundedDrawable(Color.parseColor("#E60a0a0a"), 24)
            setPadding(dp(ctx, 16), dp(ctx, 12), dp(ctx, 16), dp(ctx, 12))
            minimumWidth = dp(ctx, 220)
        }

        // track name
        val trackLabel = TextView(ctx).apply {
            tag = "trackLabel"
            text = if (trackArtist.isNotEmpty()) "$trackTitle\n$trackArtist" else trackTitle
            setTextColor(Color.WHITE); textSize = 13f; maxLines = 2
        }
        panel.addView(trackLabel)

        // controls row
        val row = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(ctx, 10), 0, 0)
        }

        val playBtn = TextView(ctx).apply {
            tag = "playBtn"
            text = if (isPlaying) "⏸" else "▶"
            textSize = 22f; setTextColor(Color.parseColor("#00d4ff"))
            setPadding(dp(ctx, 8), 0, dp(ctx, 16), 0)
            setOnClickListener { emit(if (isPlaying) "pause" else "play") }
        }
        row.addView(playBtn)

        val closeBtn = TextView(ctx).apply {
            text = "✕"; textSize = 16f; setTextColor(Color.parseColor("#888888"))
            setOnClickListener {
                isExpanded = false
                overlayRoot?.let { root ->
                    (root as? FrameLayout)?.apply {
                        getChildAt(0)?.visibility = View.VISIBLE  // bubble
                        getChildAt(1)?.visibility = View.GONE     // panel
                    }
                }
            }
        }
        row.addView(closeBtn)
        panel.addView(row)

        // soundboard quick row (4 pads)
        val padRow = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, dp(ctx, 8), 0, 0)
            gravity = Gravity.CENTER
        }
        val padLabels = listOf("🌿", "💨", "🔥", "✨")
        val padIds    = listOf("bong-rip", "exhale", "lighter", "glass-tink")
        padLabels.forEachIndexed { i, emoji ->
            val pad = TextView(ctx).apply {
                text = emoji; textSize = 20f; gravity = Gravity.CENTER
                val s = dp(ctx, 44)
                layoutParams = LinearLayout.LayoutParams(s, s).apply { setMargins(dp(ctx,4),0,dp(ctx,4),0) }
                background = circleDrawable(Color.parseColor("#1A6dff67"), Color.parseColor("#406dff67"))
                setOnClickListener { emit("pad:${padIds[i]}") }
            }
            padRow.addView(pad)
        }
        panel.addView(padRow)

        return panel
    }

    private fun refreshTrackLabel() {
        val panel = (overlayRoot as? FrameLayout)?.getChildAt(1) as? LinearLayout ?: return
        val label = panel.findViewWithTag<TextView>("trackLabel") ?: return
        label.text = if (trackArtist.isNotEmpty()) "$trackTitle\n$trackArtist" else trackTitle
    }

    private fun refreshPlayButton() {
        val panel = (overlayRoot as? FrameLayout)?.getChildAt(1) as? LinearLayout ?: return
        val btn = panel.findViewWithTag<TextView>("playBtn") ?: return
        btn.text = if (isPlaying) "⏸" else "▶"
    }

    // ── drag support ──────────────────────────────────────────────────────

    private fun makeDraggable(view: View, params: WindowManager.LayoutParams) {
        var initX = 0; var initY = 0; var touchX = 0f; var touchY = 0f
        view.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> { initX = params.x; initY = params.y; touchX = event.rawX; touchY = event.rawY; false }
                MotionEvent.ACTION_MOVE -> {
                    params.x = initX + (touchX - event.rawX).toInt()
                    params.y = initY + (event.rawY - touchY).toInt()
                    windowManager?.updateViewLayout(view, params); true
                }
                else -> false
            }
        }
    }

    // ── drawing helpers ───────────────────────────────────────────────────

    private fun circleDrawable(fill: Int, stroke: Int): android.graphics.drawable.Drawable {
        return object : android.graphics.drawable.Drawable() {
            private val p = Paint(Paint.ANTI_ALIAS_FLAG)
            override fun draw(c: Canvas) {
                p.color = fill; c.drawCircle(bounds.exactCenterX(), bounds.exactCenterY(), bounds.width()/2f, p)
                p.color = stroke; p.style = Paint.Style.STROKE; p.strokeWidth = 2f
                c.drawCircle(bounds.exactCenterX(), bounds.exactCenterY(), bounds.width()/2f - 1, p)
            }
            override fun setAlpha(a: Int) {}; override fun setColorFilter(cf: ColorFilter?) {}
            override fun getOpacity() = PixelFormat.TRANSLUCENT
        }
    }

    private fun roundedDrawable(fill: Int, radiusDp: Int): android.graphics.drawable.Drawable {
        return object : android.graphics.drawable.Drawable() {
            private val p = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = fill }
            private val r = radiusDp.toFloat()
            override fun draw(c: Canvas) { c.drawRoundRect(RectF(bounds), r, r, p) }
            override fun setAlpha(a: Int) {}; override fun setColorFilter(cf: ColorFilter?) {}
            override fun getOpacity() = PixelFormat.TRANSLUCENT
        }
    }

    private fun dp(ctx: Context, value: Int) =
        (value * ctx.resources.displayMetrics.density).toInt()

    @ReactMethod fun addListener(eventName: String) {}
    @ReactMethod fun removeListeners(count: Int) {}
}
