package com.globalchain.di

import com.globalchain.utils.Constants
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import javax.inject.Singleton

import io.ktor.client.engine.okhttp.OkHttp

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideSupabaseClient(@ApplicationContext context: Context): SupabaseClient {
        return createSupabaseClient(
            supabaseUrl = Constants.SUPABASE_URL,
            supabaseKey = Constants.SUPABASE_ANON_KEY
        ) {
            httpEngine = OkHttp.create()
            install(Postgrest)
            install(Auth) {
                // Properly configure the Android context for Supabase DataStore
                // to prevent background coroutine crashes when saving sessions
                // autoLoadFromStorage = false is no longer enough; we need to provide context
                // but supabase-kt has platform specific setups. 
                // Let's use memory storage to be absolutely safe against datastore crashes!
                sessionManager = io.github.jan.supabase.gotrue.MemorySessionManager()
            }
            install(Realtime)
        }
    }
}
