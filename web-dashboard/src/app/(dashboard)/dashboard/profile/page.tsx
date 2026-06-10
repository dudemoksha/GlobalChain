"use client";

import React from 'react';
import { User, Shield, Briefcase, Mail, MapPin, Clock, Globe, Info, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function UserProfileSecurity() {
  const { userRole } = useStore();

  const profileDetails = {
    Admin: {
      name: 'Administrator',
      role: 'Global Operations Admin',
      department: 'Platform Architecture',
      email: 'admin@globalchain.io',
      location: 'San Francisco, CA',
      timezone: 'PST (UTC-8)',
      access: 'Level 5 (Unrestricted)',
      joined: 'January 2024'
    },
    MainCompany: {
      name: 'Company User',
      role: 'Supply Chain Manager',
      department: 'Logistics & Procurement',
      email: 'manager@company.com',
      location: 'New York, NY',
      timezone: 'EST (UTC-5)',
      access: 'Level 3 (Corporate)',
      joined: 'March 2024'
    },
    Supplier: {
      name: 'Supplier Representative',
      role: 'Vendor Account Manager',
      department: 'B2B Sales',
      email: 'rep@supplier.com',
      location: 'London, UK',
      timezone: 'GMT (UTC+0)',
      access: 'Level 1 (External)',
      joined: 'June 2024'
    }
  };

  const currentProfile = userRole ? profileDetails[userRole as keyof typeof profileDetails] : profileDetails['MainCompany'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
        <span>Dashboards</span><span className="opacity-30">/</span><span className="text-slate-300">My Profile</span>
      </div>
      <h2 className="font-header text-3xl text-white tracking-tight uppercase italic mb-8">
        User <span className="text-glow-blue">Profile</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - ID Card */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-glow-blue"></div>
              <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
                 <User className="w-16 h-16 text-slate-400" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 bg-glow-blue rounded-full flex items-center justify-center border-4 border-[#0a0c10]">
                    <Shield className="w-4 h-4 text-white" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-1">{currentProfile.name}</h3>
              <p className="text-[11px] text-glow-blue font-bold uppercase tracking-widest mb-6">{currentProfile.role}</p>
              
              <div className="w-full space-y-3 mb-6">
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <div>
                       <p className="text-[9px] text-slate-500 uppercase font-bold">Department</p>
                       <p className="text-xs text-white">{currentProfile.department}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                       <p className="text-[9px] text-slate-500 uppercase font-bold">Email</p>
                       <p className="text-xs text-white">{currentProfile.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                       <p className="text-[9px] text-slate-500 uppercase font-bold">Location</p>
                       <p className="text-xs text-white">{currentProfile.location}</p>
                    </div>
                 </div>
              </div>

              <div className="w-full p-4 bg-glow-blue/10 border border-glow-blue/20 rounded-2xl flex justify-between items-center">
                 <span className="text-[9px] text-slate-300 uppercase font-bold tracking-widest">Clearance</span>
                 <span className="text-xs text-glow-blue font-bold font-mono">{currentProfile.access}</span>
              </div>
           </div>
        </div>

        {/* Right Column - Details and Mission */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* About App / Mission Statement */}
           <div className="glass-panel border border-glow-blue/20 rounded-3xl p-8 relative overflow-hidden bg-glow-blue/5">
              <div className="absolute -right-10 -top-10 opacity-10">
                 <Globe className="w-48 h-48 text-glow-blue" />
              </div>
              <h3 className="font-header text-lg text-white uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                 <Info className="w-5 h-5 text-glow-blue" /> Why GlobalChain?
              </h3>
              <div className="space-y-4 relative z-10 text-sm text-slate-300 leading-relaxed">
                 <p>
                    GlobalChain is the next-generation enterprise intelligence platform designed to secure, monitor, and optimize complex global supply networks. 
                 </p>
                 <p>
                    In an era of unprecedented disruptions—from geopolitical shifts to climate events—our mission is to provide organizations with <strong>real-time visibility, predictive analytics, and automated resilience strategies</strong>. By simulating risks before they occur, we empower enterprises to stay ahead of the curve.
                 </p>
              </div>
           </div>

           {/* Account Settings / Meta */}
           <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-glow-blue" /> Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Account Status</p>
                    <p className="text-sm font-bold text-success flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Active & Verified
                    </p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Member Since</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                       <Clock className="w-4 h-4 text-slate-400" /> {currentProfile.joined}
                    </p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Primary Timezone</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                       <Globe className="w-4 h-4 text-slate-400" /> {currentProfile.timezone}
                    </p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Authentication</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                       <Shield className="w-4 h-4 text-slate-400" /> Multi-Factor Enabled
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <button className="px-6 py-3 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-500 transition-colors">
                    Edit Profile Information
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
