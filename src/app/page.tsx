import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold font-raleway text-primary">
                Merge
              </h1>
            </div>
            <div className="hidden md:flex space-x-12">
              <a href="#features" className="text-normal-text hover:text-white font-medium transition-colors">Features</a>
              <a href="#courses" className="text-normal-text hover:text-white font-medium transition-colors">Courses</a>
              <a href="#research" className="text-normal-text hover:text-white font-medium transition-colors">Research</a>
              <a href="#contact" className="text-normal-text hover:text-white font-medium transition-colors">Contact</a>
            </div>
            <div className="flex space-x-4">
              <button className="text-white font-semibold hover:text-normal-text transition-colors">Sign In</button>
              <button className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all">
                Get Started
              </button>
              
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-destructive/50 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
                Trusted by 50,000+ Students Worldwide
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold font-raleway text-heading leading-tight mb-6">
                Advanced Learning
                <span className="block text-primary">for Tomorrow's Leaders</span>
              </h1>
              <p className="text-xl text-normal-text leading-relaxed mb-10 max-w-lg">
                Accelerate your academic and professional growth with research-backed methodologies, 
                expert-curated content, and cutting-edge learning technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg">
                  Start Free Trial
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all">
                  View Curriculum
                </button>
              </div>
              <Input />
              <div className="grid grid-cols-3 gap-8 ">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-sm text-normal-text">Course Completion</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
                  <div className="text-sm text-normal-text">Student Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">85%</div>
                  <div className="text-sm text-normal-text">Career Advancement</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-heading">Current Progress</h3>
                    <span className="text-sm text-gray-500">Advanced Computer Science</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-gray-700 font-medium">Data Structures & Algorithms</span>
                      </div>
                      <span className="text-white font-semibold">92%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-gray-700 font-medium">Machine Learning Fundamentals</span>
                      </div>
                      <span className="text-white font-semibold">78%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-gray-700 font-medium">System Design Principles</span>
                      </div>
                      <span className="text-gray-500">In Progress</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-normal-text">Next Milestone</span>
                      <span className="text-white font-semibold">Capstone Project</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">4.9★</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
                <div className="text-xs text-normal-text">Certificate Ready</div>
                <div className="text-sm font-semibold text-white">2 Courses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-heading mb-6">
              Built for Academic Excellence
            </h2>
            <p className="text-xl text-normal-text max-w-3xl mx-auto">
              Our platform integrates seamlessly with university curricula and research methodologies 
              to enhance your educational experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Research-Based Curriculum</h3>
              <p className="text-normal-text leading-relaxed">
                Content developed in partnership with leading universities and validated through 
                peer-reviewed educational research.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Advanced Analytics</h3>
              <p className="text-normal-text leading-relaxed">
                Track your learning patterns, identify knowledge gaps, and receive 
                data-driven recommendations for optimal study strategies.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Academic Integration</h3>
              <p className="text-normal-text leading-relaxed">
                Seamlessly connect with your university's LMS, sync with course schedules, 
                and collaborate on group projects.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Peer Collaboration</h3>
              <p className="text-normal-text leading-relaxed">
                Connect with classmates, form study groups, and participate in academic 
                discussions with students from top universities.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Accredited Certificates</h3>
              <p className="text-normal-text leading-relaxed">
                Earn certificates recognized by industry leaders and academic institutions 
                to enhance your professional portfolio.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-destructive/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-4">Adaptive Learning</h3>
              <p className="text-normal-text leading-relaxed">
                AI-powered system adapts to your learning pace and style, ensuring optimal 
                knowledge retention and academic performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-heading mb-6">
              Trusted by Students Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Alex Chen", 
                role: "Computer Science, Stanford", 
                testimonial: "The research-backed approach helped me excel in my algorithms course. The adaptive learning system identified my weak points and provided targeted practice.",
                grade: "4.0 GPA"
              },
              { 
                name: "Maria Rodriguez", 
                role: "Data Science, MIT", 
                testimonial: "Integration with our university's curriculum was seamless. The peer collaboration features transformed how our study group approaches complex problems.",
                grade: "Summa Cum Laude"
              },
              { 
                name: "James Wilson", 
                role: "Engineering, Cambridge", 
                testimonial: "The advanced analytics helped me optimize my study schedule. I could focus on areas that needed improvement while maintaining my academic performance.",
                grade: "First Class Honors"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-heading">{testimonial.name}</div>
                    <div className="text-normal-text text-sm">{testimonial.role}</div>
                  </div>
                  <div className="text-sm font-semibold text-white">{testimonial.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of students who have enhanced their academic performance and 
            career prospects with MergeLearn's advanced learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-white transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-bold font-roboto mb-4">
                MergeLearn
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Advancing higher education through innovative learning technologies and research-based methodologies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MergeLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

