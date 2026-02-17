import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-semibold text-primary">ABOUT NARRATELY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Narrately - AI Video{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Creation Studio
            </span>
          </h1>
          <p className="text-xl text-foreground/70 mb-8">
            A powerful, user-friendly platform built with cutting-edge AI technology to revolutionize how you create professional videos.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-foreground/70 mb-4">
                We believe that creating professional, engaging videos should be accessible to everyone, regardless of technical skill or budget.
              </p>
              <p className="text-lg text-foreground/70 mb-4">
                Narrately empowers creators, businesses, and teams to transform their ideas into stunning visual content using the power of artificial intelligence.
              </p>
              <p className="text-lg text-foreground/70">
                Our platform removes barriers to video creation, making it faster, easier, and more affordable than ever before.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                The Future of Video
              </h3>
              <p className="text-foreground/70">
                AI-powered creation is not the future—it's here now. Join thousands of creators already transforming their storytelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-foreground/60 mb-12">
            A comprehensive suite of tools designed specifically for modern content creators
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '🧩',
                title: 'Avatar Groups',
                description: 'Browse and manage user-created avatar groups for your projects',
              },
              {
                icon: '📋',
                title: 'Extensive Templates',
                description: 'Access all available HeyGen video templates to jumpstart your creation',
              },
              {
                icon: '🔎',
                title: 'Scene Inspector',
                description: 'View detailed scene JSON data with template preview capabilities',
              },
              {
                icon: '🤖',
                title: 'AI Script Generation',
                description: 'Generate engaging video scripts automatically based on your descriptions',
              },
              {
                icon: '✨',
                title: 'Text to Video',
                description: 'Convert text prompts directly into professional quality videos',
              },
              {
                icon: '🎙️',
                title: 'Voice Synthesis',
                description: 'Professional voice generation with multiple language support',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built on Modern Technology
          </h2>
          <p className="text-lg text-foreground/60 mb-12">
            Narrately is engineered with the latest web technologies to ensure speed, reliability, and scalability
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend',
                items: ['React 18', 'TypeScript', 'Vite', 'TailwindCSS'],
              },
              {
                title: 'Backend',
                items: ['Node.js', 'Express', 'Modern APIs', 'Cloud Ready'],
              },
              {
                title: 'AI Integration',
                items: ['HeyGen API', 'AI Script Gen', 'Voice Synthesis', 'Avatar Tech'],
              },
            ].map((tech, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-background border border-border"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {tech.title}
                </h3>
                <ul className="space-y-2">
                  {tech.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-foreground/70 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-10 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-border/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">🎨</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  User-Centric Design
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Every feature, every button, every interaction has been carefully crafted with the creator in mind. We believe that powerful tools should be intuitive and enjoyable to use. Our clean, modern interface removes complexity while maintaining professional-grade capabilities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-5xl">⚡</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Performance First
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Speed matters when you're creating content on deadline. Narrately is built for performance, with lightning-fast video generation and a snappy, responsive interface that keeps up with your creative workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Passionate Team
          </h2>
          <p className="text-lg text-foreground/60 mb-12 max-w-2xl mx-auto">
            Behind Narrately is a team of creators, engineers, and designers dedicated to making video creation accessible to everyone.
          </p>

          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-12 rounded-lg border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join Our Community
            </h3>
            <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
              We're growing fast and would love to hear from you. Whether you're a creator looking to streamline your workflow or a business exploring video content, we're here to help you succeed.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to start creating?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Join thousands of creators already using Narrately to transform their storytelling
          </p>
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold mx-auto"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
