import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobList from "../components/job/JobList";
import jobService from "../services/jobService";

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    salary: "all",
    experience: "all",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      location: "all",
      salary: "all",
      experience: "all",
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await jobService.testConnection();
        if (isConnected) {
          console.log('✅ API connection successful');
        } else {
          console.log('⚠️ API connection failed, using localStorage');
        }
      } catch (error) {
        console.log('⚠️ API connection failed, using localStorage:', error.message);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      data-oid=".br:f7n"
    >
      <div className="mb-8" data-oid="_151f37">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-4"
              data-oid="afl7:q1"
            >
              Find Your Next Opportunity
            </h1>
            <p className="text-lg text-gray-600" data-oid="0x.483t">
              Browse through our curated list of job opportunities
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Jobs
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4" data-oid="u4i2y:3">
          <div className="flex gap-4 items-center" data-oid="5pokh.4">
            <div className="flex-1 relative" data-oid="o:i66vy">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                data-oid="8v31x9a"
              >
                <Search className="h-5 w-5 text-gray-400" data-oid="f60amr7" />
              </div>
              <Input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full"
                data-oid="fj6ok6s"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
              data-oid="cv:1dr_"
            >
              <SlidersHorizontal className="h-5 w-5" data-oid="de2hmwt" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div
              className="bg-white p-4 rounded-lg border border-gray-200 space-y-4"
              data-oid="xkksf_j"
            >
              <div
                className="flex justify-between items-center mb-4"
                data-oid="_5wvo64"
              >
                <h3 className="font-semibold" data-oid="51uo0m8">
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  data-oid=":4yjqfz"
                >
                  Clear all
                </Button>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                data-oid="np0k-o2"
              >
                <div data-oid="1qamimy">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-oid="r55_dr5"
                  >
                    Job Type
                  </label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                    data-oid=".k4:v72"
                  >
                    <SelectTrigger className="w-full" data-oid="cxrr.e2">
                      <SelectValue
                        placeholder="Select type"
                        data-oid="45pyxov"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid="3uwq05a">
                      <SelectItem value="all" data-oid="q0fxspr">
                        All Types
                      </SelectItem>
                      <SelectItem value="full-time" data-oid="h17bje.">
                        Full Time
                      </SelectItem>
                      <SelectItem value="part-time" data-oid="yqi0:f7">
                        Part Time
                      </SelectItem>
                      <SelectItem value="contract" data-oid="iwjig3w">
                        Contract
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div data-oid="hzypc08">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-oid="rlozdro"
                  >
                    Location
                  </label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      handleFilterChange("location", value)
                    }
                    data-oid="dx4totk"
                  >
                    <SelectTrigger className="w-full" data-oid="pgz62yb">
                      <SelectValue
                        placeholder="Select location"
                        data-oid="ws9ul.j"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid="t9fz_8h">
                      <SelectItem value="all" data-oid="j6rsvfb">
                        All Locations
                      </SelectItem>
                      <SelectItem value="Hyderabad" data-oid="viys.wy">
                        Hyderabad
                      </SelectItem>
                      <SelectItem value="Bangalore" data-oid="a:w4.rz">
                        Bangalore
                      </SelectItem>
                      <SelectItem value="Mumbai" data-oid="oxwniu7">
                        Mumbai
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div data-oid="ft_bxp9">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-oid="ok44k1d"
                  >
                    Salary Range
                  </label>
                  <Select
                    value={filters.salary}
                    onValueChange={(value) =>
                      handleFilterChange("salary", value)
                    }
                    data-oid="60tp-v_"
                  >
                    <SelectTrigger className="w-full" data-oid="rs35dhn">
                      <SelectValue
                        placeholder="Select salary range"
                        data-oid="_wetz.8"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid=".61dhk5">
                      <SelectItem value="all" data-oid="q23xdma">
                        All Ranges
                      </SelectItem>
                      <SelectItem value="0-300000" data-oid="1o_2-ho">
                        ₹0 - ₹300,000
                      </SelectItem>
                      <SelectItem value="300000-600000" data-oid="5loy587">
                        ₹300,000 - ₹600,000
                      </SelectItem>
                      <SelectItem value="600000+" data-oid="q23xdma">
                        ₹600,000+
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div data-oid="egr3l5c">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-oid="sv5zz1o"
                  >
                    Experience
                  </label>
                  <Select
                    value={filters.experience}
                    onValueChange={(value) =>
                      handleFilterChange("experience", value)
                    }
                    data-oid="08vho.c"
                  >
                    <SelectTrigger className="w-full" data-oid="tn5jxko">
                      <SelectValue
                        placeholder="Select experience"
                        data-oid="wkwjfs7"
                      />
                    </SelectTrigger>
                    <SelectContent data-oid=".43oy4k">
                      <SelectItem value="all" data-oid="q23r9rm">
                        All Experience
                      </SelectItem>
                      <SelectItem value="0-1" data-oid="kem1awu">
                        0-1 years
                      </SelectItem>
                      <SelectItem value="1-3" data-oid=".s0p:gn">
                        1-3 years
                      </SelectItem>
                      <SelectItem value="3-5" data-oid="7yahhuv">
                        3-5 years
                      </SelectItem>
                      <SelectItem value="5+" data-oid="9rif4-6">
                        5+ years
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <JobList 
        key={refreshKey}
        searchQuery={searchQuery} 
        filters={filters} 
        data-oid="3z0x9g-" 
      />
    </div>
  );
};

export default JobsPage;
