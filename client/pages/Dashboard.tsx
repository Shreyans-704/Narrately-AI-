import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Upload, Zap, History, AlertCircle, Flame } from 'lucide-react';

export default function Dashboard() {
  const { user, getTrialDaysRemaining, isTrialActive } = useAuthStore();
  const trialDaysRemaining = getTrialDaysRemaining();
  const onTrial = isTrialActive();

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="pt-20 min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Create Your Next Video
            </h1>
            <p className="text-lg text-foreground/60">
              Generate stunning AI videos in minutes
            </p>
          </div>

          {/* Trial Status & Credit Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Trial Status Card */}
            {onTrial && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/70 text-sm mb-1 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-accent" />
                      Trial Status
                    </p>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {trialDaysRemaining} Days
                    </p>
                    <p className="text-foreground/60 text-xs">
                      Remaining in your free trial
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Credit Balance Card */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm mb-1">Your Credits</p>
                  <p className="text-4xl font-bold text-foreground">
                    {user?.credit_balance ?? 100}
                  </p>
                  <p className="text-foreground/50 text-xs mt-2">
                    {onTrial ? 'Trial credits - Use freely!' : 'Pay-as-you-go credits'}
                  </p>
                </div>
                <Zap className="w-12 h-12 text-accent opacity-50" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prompt Input */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Describe Your Video
                </h2>
                <textarea
                  placeholder="Enter your video concept, script, or description..."
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-32"
                />
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold">
                  Generate Video
                </Button>
              </div>

              {/* Image Upload */}
              <div className="p-6 rounded-xl bg-card border border-border border-dashed">
                <div className="text-center py-12">
                  <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-3" />
                  <p className="text-foreground/60 mb-2">
                    Drag and drop your image here
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Voice Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Voice Type
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Narration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Language
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - History */}
            <div className="space-y-6">
              {/* Video History */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Videos
                  </h2>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors cursor-pointer"
                    >
                      <div className="aspect-video bg-background rounded mb-2 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        Video {i}
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        2 days ago
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60">Videos Created</span>
                    <span className="font-bold text-foreground">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60">Total Views</span>
                    <span className="font-bold text-foreground">1.2K</span>
                  </div>
                  {onTrial && (
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-foreground/60">Trial Days Left</span>
                      <span className="font-bold text-primary flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {trialDaysRemaining}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60">Account Status</span>
                    <span className={`font-bold text-xs px-2 py-1 rounded-full ${
                      onTrial
                        ? 'bg-primary/20 text-primary'
                        : 'bg-foreground/10 text-foreground/70'
                    }`}>
                      {onTrial ? 'Trial Active' : 'Premium'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
