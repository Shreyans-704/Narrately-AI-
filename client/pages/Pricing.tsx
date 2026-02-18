import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Zap } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out Narrately',
      features: [
        '30 free credits to start',
        'Basic avatars',
        'Text to video',
        'Email support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '₹250',
      period: '/month',
      description: 'Great for content creators',
      features: [
        'Unlimited videos',
        'Advanced avatars',
        'All AI features',
        '100+ templates',
        'Custom branding',
        'API access',
        'Priority support',
        'Monthly credits',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '₹700',
      period: '/month',
      description: 'For large teams and agencies',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'Team management',
        'Advanced analytics',
        'White-label options',
        '24/7 phone support',
        'Custom SLA',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'What are credits?',
      answer:
        'Credits are used to generate videos. Each minute of video costs 1-5 credits depending on complexity and features used. You get monthly credits based on your subscription plan.',
    },
    {
      question: 'Can I upgrade or downgrade anytime?',
      answer:
        'Yes! You can change your plan at any time. We\'ll prorate your charges based on your usage.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer:
        'Yes, we offer 20% discount if you pay annually. Contact our sales team for more details.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Absolutely! Start with 30 free credits to explore all features without any payment.',
    },
  ];

  return (
    <div className="min-h-screen bg-background dark relative">
      {/* Site-wide N background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/ai-bg.svg" alt="" className="w-full h-full object-cover opacity-50" />
        <div className="floating-logos" aria-hidden>
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--large" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </div>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/90 mb-4">
            Choose the perfect plan for your video creation needs
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl border transition-all ${
                  plan.highlighted
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-background shadow-2xl scale-105'
                    : 'border-border bg-card/50 hover:border-primary/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-foreground/85 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-foreground/85 ml-2">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => navigate('/signup')}
                    className={`w-full mb-8 ${
                      plan.highlighted
                        ? 'bg-primary hover:bg-primary/90 text-white'
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-foreground/85">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-foreground/90">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-foreground/90 mb-6">
              Our support team is here to help. Contact us anytime.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Contact Support
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
          <p className="text-lg text-foreground/85 mb-8">
            All plans include 30 free credits to get started. No credit card required.
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
