package com.globalchain

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class GlobalChainApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize global components here (e.g., Timber, Analytics)
    }
}
