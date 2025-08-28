import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Trophy,
  Target,
  Rocket,
  Building2,
  BarChart as ChartBar,
  Clock,
  Shield,
  Code,
  Stethoscope,
  PieChart as ChartPie,
  Pencil,
  Building,
  Truck,
  Wrench,
  Leaf,
  Gavel,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import companies from "../data/companies.json";
// import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { InfiniteSlider } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import JobList from "../components/job/JobList";

const HomePage = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const categories = [
    {
      icon: Code,
      name: "Technology",
      jobs: "Software, Data, IT",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Stethoscope,
      name: "Healthcare",
      jobs: "Medical, Nursing, Health",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: ChartPie,
      name: "Business",
      jobs: "Finance, Marketing, Sales",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Pencil,
      name: "Creative",
      jobs: "Design, Media, Arts",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Building,
      name: "Corporate",
      jobs: "Management, HR, Admin",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Truck,
      name: "Logistics",
      jobs: "Transport, Supply Chain",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Wrench,
      name: "Engineering",
      jobs: "Civil, Mechanical, Electrical",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: Leaf,
      name: "Environment",
      jobs: "Sustainability, Green Tech",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Gavel,
      name: "Legal",
      jobs: "Law, Paralegal, Compliance",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" data-oid="0nk:wfc">
      {/* Hero Section */}

      <section
        className="  min-h-screen flex items-start bg-blue-500  text-white py-18  px-4 sm:px-6 lg:px-8"
        data-oid="exeiw8l"
      >
        <div className="max-w-7xl mx-auto" data-oid="ygptwm7">
          <div className="text-center" data-oid="5mre_nv">
            <h1
              className="text-5xl sm:text-5xl md:text-7xl  lg:text-8xl font-black sm:tracking-tight mb-4 py-10"
              data-oid=":u0jnub"
            >
              Find Your Dream Job Today
            </h1>
            <p
              className="text-xl max-w-3xl  mx-auto opacity-90 mb-8"
              data-oid="maal1.s"
            >
              Connect with top companies hiring now. Thousands of jobs in tech,
              marketing, sales and more!
            </p>
            <div
              className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-2 flex"
              data-oid="js4y5n2"
            >
              <div className="flex-grow" data-oid="ezployo">
                <div
                  className="flex items-center h-full pl-4"
                  data-oid="2y4rioh"
                >
                  <Search
                    className="h-5 w-5 text-gray-400"
                    data-oid="6t.zdg1"
                  />
                  <input
                    type="text"
                    placeholder="Job title, skills or company"
                    className="appearance-none w-full pl-3 py-2 border-none focus:outline-none focus:ring-0 text-gray-900"
                    data-oid="6hnz3gd"
                  />
                </div>
              </div>
              <Link to="/jobs" data-oid=".rbb956">
                <Button variant="blue" data-oid="3eroyb6">
                  Search Jobs
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="flex flex-wrap gap-4 justify-center mt-10"
            data-oid="-:4u65i"
          >
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3   rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
              data-oid="bds4av1"
            >
              Find Jobs
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
              data-oid="tjijw8m"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
      {/* Featured Jobs Section */}
      <section
        className="bg-white py-12 px-8 sm:px-6 lg:px-8"
        data-oid="b0alnu5"
      >
        <div className="max-w-7xl mx-auto" data-oid="8b3a:yw">
          <div className="text-center mb-10" data-oid="6.vibyr">
            <h2 className="text-3xl font-bold text-gray-900" data-oid="ru7mqu-">
              Featured Jobs
            </h2>
            <p className="mt-3 text-xl text-gray-600" data-oid="rvqq2q5">
              Handpicked opportunities from top companies
            </p>
          </div>
          <JobList limit={3} data-oid="pr0wwsz" />
          <div className="mt-10 text-center" data-oid="c47w30.">
            <Link to="/jobs" onClick={handleClick} data-oid="z7qd:wn">
              <Button variant="outline" data-oid="kazj-e4">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Job Categories Section */}
      <section className="py-20 bg-white" data-oid="z056d18">
        <div className="container mx-auto px-10 sm:px-4" data-oid="g30_.:7">
          <div className="text-center mb-12" data-oid="7-de9yy">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              data-oid="apyrcl6"
            >
              Explore Job Categories
            </h2>
            <p className="text-xl text-gray-600" data-oid="xydhj3q">
              Discover opportunities across various industries
            </p>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 md:px-20"
            data-oid="w6ypmb9"
          >
            {categories.map((category, index) => (
              <Link
                key={index}
                // to="/jobs"
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                data-oid="ypfq:kg"
              >
                <div className="flex items-start space-x-4" data-oid="906y8jr">
                  <div
                    className={`p-3 rounded-lg ${category.color}`}
                    data-oid="t27hsrp"
                  >
                    <category.icon className="w-6 h-6" data-oid="q9nw645" />
                  </div>
                  <div data-oid=".n-.0a7">
                    <h3
                      className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                      data-oid="ut.b:en"
                    >
                      {category.name}
                    </h3>
                    <p className="mt-2 text-gray-600" data-oid="fghjspv">
                      {category.jobs}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* For Candidates Section */}
      <section className="py-20 bg-white" data-oid=":yvuzt_">
        <div className="container mx-auto px-10 sm:px-4" data-oid="6afmjrk">
          <div className="max-w-6xl mx-auto" data-oid="x20ds1y">
            <div className="text-center mb-16" data-oid=".jmnl_a">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                data-oid="lp5swk5"
              >
                For Job Seekers
              </h2>
              <p className="text-xl text-gray-600" data-oid="zx-sgt9">
                Stand out in the job market
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="s:kda.a"
            >
              <div
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                data-oid="1ogu3:a"
              >
                <Search
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid="clq77:7"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="8bqahur">
                  Smart Search
                </h3>
                <p className="text-gray-600" data-oid="lgbnzzw">
                  Find relevant jobs with our intelligent search system
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                data-oid="aiqjf53"
              >
                <ChartBar
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid="n4hw06j"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="19utpwt">
                  Market Insights
                </h3>
                <p className="text-gray-600" data-oid="x_g0h5p">
                  Get real-time salary and industry trend data
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                data-oid="6sok:s."
              >
                <Clock
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid="mnekeib"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="x0ft3mg">
                  Easy Apply
                </h3>
                <p className="text-gray-600" data-oid=".6rvk8d">
                  One-click applications with smart profiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* For Employers Section */}
      <section className="py-20 bg-white" data-oid="i55kkm9">
        <div className="container mx-auto px-10 sm:px-4" data-oid="u_5bwhi">
          <div className="max-w-6xl mx-auto" data-oid=":emza.r">
            <div className="text-center mb-16" data-oid="713dd7i">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                data-oid="c69i9s7"
              >
                For Employers
              </h2>
              <p className="text-xl text-gray-600" data-oid="_gs:pdh">
                Find your next star employee
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="-m6u6_h"
            >
              <div
                className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
                data-oid="byl.v9d"
              >
                <Users
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid=".aa:i_3"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="1o7tjp7">
                  Growing Network
                </h3>
                <p className="text-gray-600" data-oid="s7y1g_e">
                  Connect with motivated candidates actively seeking
                  opportunities
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
                data-oid="8_g3fxj"
              >
                <Building2
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid="7s9rjup"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="q56w:ev">
                  Company Showcase
                </h3>
                <p className="text-gray-600" data-oid="afo1xhw">
                  Build your employer brand with a custom profile
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
                data-oid="j86axnb"
              >
                <Trophy
                  className="w-10 h-10 text-blue-600 mb-4"
                  data-oid="u1pvxpm"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid=".66q.5w">
                  Dedicated Support
                </h3>
                <p className="text-gray-600" data-oid="dxu8fce">
                  Get personalized assistance for your hiring needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why us */}
      <section className="py-20  bg-white" data-oid="6:7h32s">
        <div className="container mx-auto px-10 sm:px-4 " data-oid="f9fv103">
          <div className="max-w-6xl mx-auto" data-oid="zyyk777">
            <div className="text-center mb-16" data-oid="uce.p04">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                data-oid="aga5jr1"
              >
                Why Choose Us
              </h2>
              <p className="text-xl text-gray-600" data-oid="314n86w">
                Next-generation features for better job matching
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              data-oid="it1zea3"
            >
              <div
                className="p-6 border border-gray-200 rounded-xl  hover:shadow-lg transition-colors duration-300"
                data-oid="unl_8cq"
              >
                <Target
                  className="w-12 h-12 text-blue-600 mb-4"
                  data-oid="nlp8ew7"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="_v:lxxb">
                  Smart Matching
                </h3>
                <p className="text-gray-600" data-oid="rw.ajm2">
                  Smart algorithms that understand your requirements and match
                  you with the right opportunities
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-xl transition-colors hover:shadow-lg duration-300"
                data-oid="dhep8fk"
              >
                <Shield
                  className="w-12 h-12 text-blue-600 mb-4"
                  data-oid="x4kds8j"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="ftugf_i">
                  Verified Employers
                </h3>
                <p className="text-gray-600" data-oid="cdinusp">
                  All companies are thoroughly verified to ensure safe and
                  legitimate job postings
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-xl  transition-colors hover:shadow-lg duration-300"
                data-oid="m:pniuo"
              >
                <Rocket
                  className="w-12 h-12 text-blue-600 mb-4"
                  data-oid="i.yggi3"
                />
                <h3 className="text-xl font-semibold mb-3" data-oid="9dnxl03">
                  Quick Apply
                </h3>
                <p className="text-gray-600" data-oid="y83wle2">
                  Apply to multiple jobs with a single click using your smart
                  profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-16 px-4 sm:px-6 lg:px-8"
        data-oid="s8_bcpy"
      >
        <div className="max-w-7xl mx-auto text-center" data-oid=".8m33.1">
          <h2 className="text-3xl font-bold mb-4" data-oid="2232xgb">
            Ready to Start Your Job Search?
          </h2>
          <p
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            data-oid="-rkd9uy"
          >
            Join thousands of job seekers who have found their dream jobs
            through our platform.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4"
            data-oid="_z0-0-a"
          >
            <Link to="/register" data-oid="e54uu1f">
              <Button variant="blue" size="lg" data-oid="tm9l530">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/jobs" data-oid="yacoqg3">
              <Button variant="danger" size="lg" data-oid="zdb.u23">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Client Logos Section */}
      {/* <Carousel
         plugins={[
           Autoplay({
             delay: 2000,
           }),
         ]}
         opts={{
           loop: true,
           slidesToScroll: 1,
         }}
         className="bg-gray-900 w-full py-10"
        >
         <CarouselContent className="flex gap-5 sm:gap-5 items-center">
           {companies.map(({ name, id, path }) => (
             <CarouselItem key={id} className="basis-1/3 lg:basis-1/5">
               <img
                 src={path}
                 alt={name}
                 className="h-6 sm:h-8 object-contain"
               />
             </CarouselItem>
           ))}
         </CarouselContent>
        </Carousel> */}

      <InfiniteSlider
        gap={112}
        duration={40}
        durationOnHover={60}
        className="bg-gray-900 w-full py-10"
        data-oid="wo1hmes"
      >
        {companies.map(({ name, id, path }) => (
          <div
            key={id}
            className="basis-1/3 lg:basis-1/5 flex justify-center items-center"
            data-oid="9y7mxwp"
          >
            <img
              src={path}
              alt={name}
              className="h-6 sm:h-8 object-contain"
              data-oid="tgxlcsh"
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
};

export default HomePage;
