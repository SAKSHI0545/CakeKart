import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi! I'd like to know more about your cakes and services.`;
    const whatsappUrl = `https://wa.me/918888888888?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-primary text-primary-foreground mb-4">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact <span className="text-primary">Sweet Delights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a question about our cakes? Want to place a custom order? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us through any of these channels. We're here to make your cake dreams come true!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <Card className="card-elegant group hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground mb-2">Call us for instant support</p>
                    <p className="font-medium">+91 88888 88888</p>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant group hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground mb-2">Send us your queries</p>
                    <p className="font-medium">hello@sweetdelights.com</p>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant group hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Our Store</h3>
                    <p className="text-muted-foreground mb-2">Come taste our creations</p>
                    <p className="font-medium">123 Baker Street, Sweet City, Mumbai - 400001</p>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant group hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Store Hours</h3>
                    <p className="text-muted-foreground mb-2">When we're open</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Mon - Sat:</span> 9:00 AM - 9:00 PM</p>
                      <p><span className="font-medium">Sunday:</span> 10:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>
              
              {/* Social Media */}
              <div className="flex space-x-4 justify-center">
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="card-elegant">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Map Section */}
        <Card className="card-elegant mt-12 p-0 overflow-hidden">
          <div className="bg-gradient-hero p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Find Us</h3>
            <p className="text-muted-foreground">Visit our store for fresh cakes and personalized consultations</p>
          </div>
          <div className="h-64 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Interactive Map Coming Soon</p>
              <p className="text-sm">123 Baker Street, Sweet City, Mumbai - 400001</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;