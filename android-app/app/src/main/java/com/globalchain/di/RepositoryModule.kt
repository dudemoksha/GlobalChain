package com.globalchain.di

import com.globalchain.data.repository.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideSupplierRepository(supabase: SupabaseClient) = SupplierRepository(supabase)

    @Provides
    @Singleton
    fun provideAlertsRepository(supabase: SupabaseClient) = AlertsRepository(supabase)

    @Provides
    @Singleton
    fun provideOrganizationRepository(supabase: SupabaseClient) = OrganizationRepository(supabase)

    @Provides
    @Singleton
    fun provideAuditRepository(supabase: SupabaseClient) = AuditRepository(supabase)
}
