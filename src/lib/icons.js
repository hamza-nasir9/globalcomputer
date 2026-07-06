import {
  Code2, Brain, Palette, Smartphone, ShieldCheck, Cloud,
  BarChart3, Video, BadgeCheck, TrendingUp, Building2, Globe,
  FlaskConical, Users, GraduationCap, BookOpen, Briefcase,
  Handshake, Trophy, ClipboardList, PhoneCall, FileText,
  CreditCard, Sparkles, Target, Eye, Lightbulb, Award, Heart,
  CheckCircle, ArrowRight, MapPin, Mail, Phone,
  ShoppingBag, Monitor, Network, Type, Laptop, Server, Star, Calculator,
} from 'lucide-react';

const ICON_MAP = {
  Code2, Brain, Palette, Smartphone, ShieldCheck, Cloud,
  BarChart3, Video, BadgeCheck, TrendingUp, Building2, Globe,
  FlaskConical, Users, GraduationCap, BookOpen, Briefcase,
  Handshake, Trophy, ClipboardList, PhoneCall, FileText,
  CreditCard, Sparkles, Target, Eye, Lightbulb, Award, Heart,
  CheckCircle, ArrowRight, MapPin, Mail, Phone,
  ShoppingBag, Monitor, Network, Type, Laptop, Server, Star, Calculator,
};

export function getIcon(name) {
  return ICON_MAP[name] ?? Sparkles;
}
