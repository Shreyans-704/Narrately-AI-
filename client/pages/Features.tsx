import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '✨',
      title: 'Text to Video',
      description: 'Turn your ideas into videos with simple text prompts. Describe your vision and let AI handle the creation.',
      details: [
        'AI-powered video generation',
        'Multiple script formats',
        'Custom styling options',
        'Real-time preview',
      ],
    },
    {
      icon: '👤',
      title: 'Custom Avatars',
      description: 'AI-generated avatars that look and sound like real people. Choose from our library or create your own.',
      details: [
        'Natural voice synthesis',
        'Emotional expressions',
        'Multiple languages',
        'Custom branding',
      ],
    },
    {
      icon: '🎙️',
      title: 'Voice Synthesis',
      description: 'Professional voice generation in multiple languages with natural intonation and emotion control.',
      details: [
        'Multi-language support',
        'Emotion control',
        'Custom voice models',
        'Lip-sync accuracy',
      ],
    },
    {
      icon: '🧩',
      title: 'Avatar Groups',
      description: 'Organize and manage multiple avatars for your different projects and content types.',
      details: [
        'Group management',
        'Template library',
        'Quick access',
        'Team collaboration',
      ],
    },
    {
      icon: '📋',
      title: 'Rich Templates',
      description: 'Access our extensive library of pre-designed templates to jumpstart your video creation.',
      details: [
        'Industry templates',
        'Custom layouts',
        'Easy customization',
        'Regular updates',
      ],
    },
    {
      icon: '🤖',
      title: 'AI Script Generation',
      description: 'Automatically generate engaging video scripts from content descriptions using advanced AI.',
      details: [
        'Smart suggestions',
        'Tone adaptation',
        'Multi-format support',
        'SEO optimization',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 min-h-[60vh] flex items-center relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Powerful AI Video Creation Tools</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            Everything you need{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              to create incredible videos
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Comprehensive suite of AI-powered tools designed to make professional video creation accessible to everyone.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-lg text-foreground/60">
              Discover the powerful capabilities that make Narrately the best choice for AI video creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="text-sm text-foreground/60 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Narrately?
            </h2>
            <p className="text-lg text-foreground/60">
              Setting the standard for AI video creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Lightning Fast',
                description: 'Create professional videos in seconds, not days. Our AI works at superhuman speed.',
              },
              {
                title: 'No Technical Skills Required',
                description: 'Intuitive interface designed for creators of all skill levels. No coding or video editing experience needed.',
              },
              {
                title: 'Unlimited Customization',
                description: 'From avatars to scripts, customize every aspect of your videos to match your brand.',
              },
              {
                title: 'Enterprise Ready',
                description: 'Built on robust infrastructure with API access and advanced team management features.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-foreground/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to create amazing videos?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Get started for free and explore all these features without any commitment.
          </p>
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold mx-auto"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
