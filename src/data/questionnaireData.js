// This file contains the questionnaire structure
export const questionnaire = [
  {
    id: 'section1',
    title: 'Basic Information & Critical Eligibility',
    questions: [
      {
        id: 'ngoName',
        text: 'What is the name of your NGO?',
        type: 'text',
        required: true
      },
      {
        id: 'ngoLocation',
        text: 'Where does your NGO operate? (Select all that apply)',
        type: 'checkbox',
        options: [
          { value: 'tier1', label: 'Tier 1 city' },
          { value: 'tier2', label: 'Tier 2 city' },
          { value: 'tier3', label: 'Tier 3 city' },
          { value: 'rural', label: 'Rural Area' }
        ],
        required: true
      },
      {
        id: 'ngoRegistrationType',
        text: 'What is your NGO registration type?',
        type: 'radio',
        options: [
          { value: 'trust', label: 'Trust' },
          { value: 'society', label: 'Society' },
          { value: 'section8', label: 'Section 8 Company' },
          { value: 'educational', label: 'Educational Institute' },
          { value: 'hospital', label: 'Hospital' }
        ],
        required: true
      },
      {
        id: 'ngoYear',
        text: 'In what year was your NGO founded/registered?',
        type: 'number',
        min: 1900,
        max: new Date().getFullYear(),
        required: true
      },
      {
        id: 'ngoComplianceStatus',
        text: 'Which of these registrations/certifications do you currently have?',
        type: 'checkbox',
        options: [
          { value: 'pan', label: 'PAN Card' },
          { value: '12a', label: 'Section 12A Registration' },
          { value: '80g', label: 'Section 80G Certification' },
          { value: 'darpan', label: 'NGO Darpan Enrollment' },
          { value: 'gst', label: 'GST Registration' },
          { value: 'fcra', label: 'FCRA Registration' },
          { value: '501c', label: '501(c) Registration' },
          { value: 'csr1', label: 'CSR-1 Registration' }
        ],
        required: true
      },
      {
        id: 'ngoForeignFundingIntent',
        text: 'Do you intend to seek funding from foreign sources?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'future', label: 'Not immediately, but in the future' }
        ],
        required: true
      },
      {
        id: 'ngoScope',
        text: 'What is your geographic scope?',
        type: 'radio',
        options: [
          { value: 'local', label: 'Local' },
          { value: 'regional', label: 'Regional' },
          { value: 'national', label: 'National' },
          { value: 'international', label: 'International' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'section2',
    title: 'NGO Profile & Maturity',
    questions: [
      {
        id: 'ngoMission',
        text: "Describe your NGO's primary mission or cause.",
        type: 'textarea',
        maxLength: 500,
        required: true
      },
      {
        id: 'ngoPrimaryBeneficiaries',
        text: 'Who are your primary beneficiaries?',
        type: 'checkbox',
        options: [
          { value: 'children', label: 'Children & Youth' },
          { value: 'women', label: 'Women & Girls' },
          { value: 'elderly', label: 'Elderly' },
          { value: 'disabilities', label: 'People with Disabilities' },
          { value: 'lgbtq', label: 'LGBTQ+ Community' },
          { value: 'minorities', label: 'Minority Communities' },
          { value: 'refugees', label: 'Refugees & Displaced Persons' },
          { value: 'rural', label: 'Rural Communities' },
          { value: 'urban', label: 'Urban Poor' },
          { value: 'environment', label: 'Environment & Wildlife' },
          { value: 'health', label: 'Healthcare Recipients' },
          { value: 'education', label: 'Education Seekers' },
          { value: 'artists', label: 'Artists & Cultural Workers' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        max: 3,
        required: true
      },
      {
        id: 'ngoSecondaryBeneficiaries',
        text: 'Who are your secondary beneficiaries?',
        type: 'checkbox',
        options: [
          { value: 'families', label: 'Families of Primary Beneficiaries' },
          { value: 'communities', label: 'Local Communities' },
          { value: 'institutions', label: 'Educational Institutions' },
          { value: 'healthcare', label: 'Healthcare Facilities' },
          { value: 'socialworkers', label: 'Social Workers' },
          { value: 'ecosystem', label: 'Local Ecosystem' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        max: 3,
        required: false
      },
      {
        id: 'ngoIndirectBeneficiaries',
        text: 'Who are the indirect beneficiaries of your work?',
        type: 'checkbox',
        options: [
          { value: 'broader_community', label: 'Broader Community' },
          { value: 'economy', label: 'Local Economy' },
          { value: 'environment', label: 'Environmental Impact' },
          { value: 'policy', label: 'Policy Makers' },
          { value: 'research', label: 'Research Community' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        required: false
      },
      {
        id: 'ngoBudget',
        text: 'Approximate annual operating budget (in USD)?',
        type: 'number',
        min: 0,
        required: true
      },
      {
        id: 'ngoStaff',
        text: 'How many paid full-time staff?',
        type: 'number',
        min: 0,
        required: true
      },
      {
        id: 'ngoVolunteers',
        text: 'Does your NGO engage volunteers?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoVolunteersCount',
              text: 'Approximate number of active volunteers?',
              type: 'number',
              min: 0,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoWebsite',
        text: 'Does your NGO have a website?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoSocialMedia',
        text: 'Is your NGO active on social media?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoSocialMediaPlatforms',
              text: 'Which platforms?',
              type: 'checkbox',
              options: [
                { value: 'facebook', label: 'Facebook' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'twitter', label: 'Twitter' },
                { value: 'linkedin', label: 'LinkedIn' },
                { value: 'youtube', label: 'YouTube' },
                { value: 'other', label: 'Other' }
              ],
              hasOther: true,
              required: true
            }
          ]
        }
      }
    ]
  },
  {
    id: 'section3',
    title: 'Online Presence & Digital Capabilities',
    questions: [
      {
        id: 'ngoDonationPage',
        text: 'Do you have a dedicated donation page on your website?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoEmailMarketing',
        text: 'Do you use email marketing for fundraising?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoEmailFrequency',
              text: 'What is the frequency of your fundraising emails?',
              type: 'radio',
              options: [
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'less', label: 'Less frequently' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoDigitalSkills',
        text: "Rate your NGO's capacity (1-5):",
        type: 'rating',
        subQuestions: [
          { id: 'digitalMarketing', text: 'Digital Marketing Skills' },
          { id: 'contentCreation', text: 'Content Creation for Digital Platforms' },
          { id: 'websiteManagement', text: 'Website Management & Technical Skills' },
          { id: 'dataAnalysis', text: 'Data Analysis & Digital Tracking' }
        ],
        required: true
      },
      {
        id: 'ngoOnlinePlatforms',
        text: 'Do you use online fundraising platforms?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoOnlinePlatformsUsed',
              text: 'Which platforms?',
              type: 'checkbox',
              options: [
                { value: 'benevity', label: 'Benevity' },
                { value: 'caf', label: 'CAF (Charities Aid Foundation)' },
                { value: 'yourcause', label: 'YourCause' },
                { value: 'globalgiving', label: 'GlobalGiving' },
                { value: 'giveindia', label: 'GiveIndia' },
                { value: 'ketto', label: 'Ketto' },
                { value: 'milaap', label: 'Milaap' },
                { value: 'charitynavigator', label: 'Charity Navigator' },
                { value: 'donorbox', label: 'DonorBox' },
                { value: 'justgiving', label: 'JustGiving' },
                { value: 'mightycause', label: 'Mightycause' },
                { value: 'razorpay', label: 'Razorpay Donations' },
                { value: 'other', label: 'Other' }
              ],
              hasOther: true,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoOnlineCampaigns',
        text: 'Has your NGO conducted any online fundraising campaigns in the past?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoOnlineCampaignDetails',
              text: 'Please briefly describe one of your most recent online fundraising campaigns and its approximate results.',
              type: 'textarea',
              maxLength: 500,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoDigitalBudget',
        text: 'Does your NGO have a budget specifically allocated for digital marketing and online fundraising activities?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoDigitalBudgetAmount',
              text: 'What is your approximate annual budget for digital marketing and online fundraising (in USD)?',
              type: 'number',
              min: 0,
              required: true,
              currencyPicker: true
            }
          ]
        }
      }
    ]
  },
  {
    id: 'section4',
    title: 'Volunteer Capacity',
    questions: [
      {
        id: 'ngoVolunteerOperations',
        text: 'Does your NGO rely on volunteers for its overall operations and program delivery?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoVolunteerPercentage',
              text: 'Approximately what percentage of your NGO\'s work is carried out by volunteers?',
              type: 'radio',
              options: [
                { value: 'less25', label: 'Less than 25%' },
                { value: '25to50', label: '25% to 50%' },
                { value: '51to75', label: '51% to 75%' },
                { value: 'over75', label: 'Over 75%' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoVolunteerManagement',
        text: 'Does your NGO have a formal volunteer management program or system in place?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoVolunteerCapacity',
        text: 'Rate your NGO\'s capacity to effectively recruit, train, and manage volunteers:',
        type: 'radio',
        options: [
          { value: '1', label: '1 - Very Limited' },
          { value: '2', label: '2 - Limited' },
          { value: '3', label: '3 - Moderate' },
          { value: '4', label: '4 - Strong' },
          { value: '5', label: '5 - Very Strong' }
        ],
        required: true
      },
      {
        id: 'ngoVolunteerFundraising',
        text: 'Has your NGO involved volunteers in fundraising activities in the past?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoVolunteerFundraisingActivities',
              text: 'In what types of fundraising activities have volunteers been involved?',
              type: 'checkbox',
              options: [
                { value: 'events', label: 'Event support' },
                { value: 'campaigning', label: 'Campaign outreach' },
                { value: 'peer', label: 'Peer-to-peer fundraising' },
                { value: 'digital', label: 'Digital content creation' },
                { value: 'admin', label: 'Administrative support' },
                { value: 'donor', label: 'Donor relations' },
                { value: 'other', label: 'Other' }
              ],
              hasOther: true,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoVolunteerChallenges',
        text: 'What are the biggest challenges in effectively utilizing volunteers?',
        type: 'checkbox',
        options: [
          { value: 'recruitment', label: 'Recruitment' },
          { value: 'training', label: 'Training' },
          { value: 'retention', label: 'Retention' },
          { value: 'management', label: 'Management & Coordination' },
          { value: 'skills', label: 'Volunteer Skill Gaps' },
          { value: 'time', label: 'Time Commitment from Volunteers' },
          { value: 'legal', label: 'Legal/Liability Concerns' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        required: true
      }
    ]
  },
  {
    id: 'section5',
    title: 'Event Experience & Infrastructure',
    questions: [
      {
        id: 'ngoEventExperience',
        text: 'Has your NGO organized any fundraising events in the past?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoEventCount',
              text: 'Approximately how many fundraising events has your NGO organized in the last 3 years?',
              type: 'radio',
              options: [
                { value: '1to2', label: '1-2' },
                { value: '3to5', label: '3-5' },
                { value: '6to10', label: '6-10' },
                { value: 'over10', label: 'Over 10' }
              ],
              required: true
            },
            {
              id: 'ngoEventTypes',
              text: 'What types of fundraising events has your NGO organized previously?',
              type: 'checkbox',
              options: [
                { value: 'galas', label: 'Galas/Dinners' },
                { value: 'concerts', label: 'Concerts/Performances' },
                { value: 'sports', label: 'Sports Events' },
                { value: 'auctions', label: 'Auctions' },
                { value: 'community', label: 'Community Fairs/Festivals' },
                { value: 'online', label: 'Online Events' },
                { value: 'p2p', label: 'Peer-to-Peer Event Challenges' },
                { value: 'other', label: 'Other' }
              ],
              hasOther: true,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoEventCapacity',
        text: "Rate your NGO's internal capacity for event organization (1-5):",
        type: 'rating',
        subQuestions: [
          { id: 'eventPlanning', text: 'Event Planning & Logistics' },
          { id: 'eventMarketing', text: 'Marketing & Promotion of Events' },
          { id: 'eventTicketing', text: 'Ticketing & Registration Management' },
          { id: 'eventVolunteers', text: 'Volunteer Coordination for Events' },
          { id: 'eventFollowup', text: 'Post-Event Follow-up & Donor Appreciation' }
        ],
        required: true
      },
      {
        id: 'ngoEventVenues',
        text: 'Does your NGO have access to suitable physical venues for hosting events?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoEventVenueDetails',
              text: 'Briefly describe the types of venues you have access to.',
              type: 'textarea',
              maxLength: 300,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoVirtualEvents',
        text: 'Does your NGO have experience with virtual or online events?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoVirtualEventTypes',
              text: 'What types of virtual events have you organized?',
              type: 'checkbox',
              options: [
                { value: 'webinars', label: 'Webinars' },
                { value: 'livestreams', label: 'Livestreamed events' },
                { value: 'virtualauctions', label: 'Virtual auctions' },
                { value: 'onlinechallenges', label: 'Online challenges' },
                { value: 'virtualconcerts', label: 'Virtual performances/concerts' },
                { value: 'other', label: 'Other' }
              ],
              hasOther: true,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoEventBudget',
        text: 'Does your NGO have a budget specifically allocated for event-based fundraising activities?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoEventBudgetAmount',
              text: 'What is your approximate budget for event-based fundraising per year (in USD)?',
              type: 'number',
              min: 0,
              required: true,
              currencyPicker: true
            }
          ]
        }
      }
    ]
  },
  {
    id: 'section6',
    title: 'Network & Relationship Capacity',
    questions: [
      {
        id: 'ngoDonorDatabase',
        text: 'Do you have a database for managing individual donor relationships?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoDonorCount',
        text: 'Approximately how many individual donors did you have in the past year?',
        type: 'radio',
        options: [
          { value: 'under100', label: 'Under 100' },
          { value: '100to500', label: '100-500' },
          { value: '500to1000', label: '500-1000' },
          { value: 'over1000', label: 'Over 1000' }
        ],
        required: true
      },
      {
        id: 'ngoDonorRelationship',
        text: 'Rate the overall strength of your NGO\'s relationships with individual donors:',
        type: 'radio',
        options: [
          { value: '1', label: '1 - Very Weak' },
          { value: '2', label: '2 - Weak' },
          { value: '3', label: '3 - Moderate' },
          { value: '4', label: '4 - Strong' },
          { value: '5', label: '5 - Very Strong' }
        ],
        required: true
      },
      {
        id: 'ngoDonorStewardship',
        text: 'Does your NGO have a system for donor stewardship and recognition?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoCorporateRelations',
        text: 'Do you have existing relationships with corporations or businesses?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoCorporatePartnersCount',
              text: 'How many corporate partners/funders have you had in the last 3 years?',
              type: 'radio',
              options: [
                { value: '1to3', label: '1-3' },
                { value: '4to10', label: '4-10' },
                { value: 'over10', label: 'Over 10' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoCorporateRelationshipStrength',
        text: 'Rate the overall strength of your NGO\'s corporate network and relationships:',
        type: 'radio',
        options: [
          { value: '1', label: '1 - Very Weak' },
          { value: '2', label: '2 - Weak' },
          { value: '3', label: '3 - Moderate' },
          { value: '4', label: '4 - Strong' },
          { value: '5', label: '5 - Very Strong' }
        ],
        required: true
      },
      {
        id: 'ngoCSRExperience',
        text: 'Do you have experience seeking CSR funding or employee giving?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoFoundationRelations',
        text: 'Do you have existing relationships with philanthropic foundations?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoFoundationCount',
              text: 'How many foundations has your NGO received grants from in the past 3 years?',
              type: 'radio',
              options: [
                { value: '1to3', label: '1-3' },
                { value: '4to10', label: '4-10' },
                { value: 'over10', label: 'Over 10' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoFoundationRelationshipStrength',
        text: 'Rate the overall strength of your NGO\'s foundation network:',
        type: 'radio',
        options: [
          { value: '1', label: '1 - Very Weak' },
          { value: '2', label: '2 - Weak' },
          { value: '3', label: '3 - Moderate' },
          { value: '4', label: '4 - Strong' },
          { value: '5', label: '5 - Very Strong' }
        ],
        required: true
      },
      {
        id: 'ngoGrantWriting',
        text: 'Does your NGO have dedicated staff or resources for grant writing?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoGovernmentRelations',
        text: 'Do you have existing relationships with government agencies relevant to your mission?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: false,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoGovernmentFundingCount',
              text: 'How many government grants has your NGO received in the past 3 years?',
              type: 'radio',
              options: [
                { value: '1to3', label: '1-3' },
                { value: '4to10', label: '4-10' },
                { value: 'over10', label: 'Over 10' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoGovernmentRelationshipStrength',
        text: 'Rate the overall strength of your NGO\'s government relationships:',
        type: 'radio',
        options: [
          { value: '1', label: '1 - Very Weak' },
          { value: '2', label: '2 - Weak' },
          { value: '3', label: '3 - Moderate' },
          { value: '4', label: '4 - Strong' },
          { value: '5', label: '5 - Very Strong' }
        ],
        required: false
      }
    ]
  },
  {
    id: 'section7',
    title: 'Resource Capacity & Constraints',
    questions: [
      {
        id: 'ngoFundraisingDept',
        text: 'Do you have a dedicated fundraising department?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoFundraisingStaffCount',
              text: 'How many paid staff are dedicated to fundraising?',
              type: 'number',
              min: 0,
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoFundraisingSkill',
        text: 'What is the skill level of your fundraising staff?',
        type: 'radio',
        options: [
          { value: 'general', label: 'Primarily General Skills' },
          { value: 'some', label: 'Some Specialized Skills' },
          { value: 'mix', label: 'Mix of Skills' },
          { value: 'specialized', label: 'Primarily Specialized Skills' }
        ],
        required: true
      },
      {
        id: 'ngoVolunteerFundraisingSupport',
        text: 'Does your NGO regularly use volunteers to support fundraising activities?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoVolunteerFundraisingCount',
              text: 'Approximately how many volunteers are typically involved in fundraising support?',
              type: 'radio',
              options: [
                { value: '1to5', label: '1-5' },
                { value: '6to20', label: '6-20' },
                { value: '21to50', label: '21-50' },
                { value: 'over50', label: 'Over 50' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoFundraisingBudget',
        text: 'What is your approximate annual fundraising budget (in USD)?',
        type: 'number',
        min: 0,
        required: true,
        currencyPicker: true
      },
      {
        id: 'ngoFundraisingBudgetPercent',
        text: 'What percentage of your total operating budget is allocated to fundraising?',
        type: 'number',
        min: 0,
        max: 100,
        required: true
      },
      {
        id: 'ngoFundraisingCapital',
        text: 'Does your NGO have readily available capital to invest in new fundraising initiatives?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'limited', label: 'Limited' }
        ],
        required: true
      },
      {
        id: 'ngoRiskTolerance',
        text: 'Is your NGO comfortable with fundraising strategies that may have variable returns?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'somewhat', label: 'To some extent' }
        ],
        required: true
      },
      {
        id: 'ngoCRM',
        text: 'Does your NGO have a CRM system to manage donor information and interactions?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoTechInfrastructure',
        text: 'Does your NGO have access to reliable internet and technology infrastructure?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoFinancialSystems',
        text: 'Does your NGO have established financial systems for managing donations?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'ngoResourceConstraints',
        text: 'What are your biggest limitations for fundraising resources?',
        type: 'checkbox',
        options: [
          { value: 'staff', label: 'Limited Fundraising Staff' },
          { value: 'skills', label: 'Lack of Specialized Skills' },
          { value: 'budget', label: 'Limited Financial Budget' },
          { value: 'volunteers', label: 'Lack of Volunteer Support' },
          { value: 'digital', label: 'Limited Digital Capacity' },
          { value: 'tech', label: 'Technology Constraints' },
          { value: 'time', label: 'Time Constraints' },
          { value: 'network', label: 'Limited Network/Connections' },
          { value: 'compliance', label: 'Compliance Burdens' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        required: true
      },
      {
        id: 'ngoEthicalConsiderations',
        text: 'Are there specific ethical considerations related to fundraising your NGO needs to consider?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true,
        conditionalQuestions: {
          yes: [
            {
              id: 'ngoEthicalDetails',
              text: 'Please briefly describe these considerations.',
              type: 'textarea',
              maxLength: 500,
              required: true
            }
          ]
        }
      }
    ]
  },
  {
    id: 'section8',
    title: 'NGO Goals & Priorities',
    questions: [
      {
        id: 'ngoFundraisingGoals',
        text: 'What are your primary fundraising goals for the next 1-3 years?',
        type: 'checkbox',
        options: [
          { value: 'increase', label: 'Increase overall funding' },
          { value: 'diversify', label: 'Diversify funding sources' },
          { value: 'unrestricted', label: 'Secure unrestricted funding' },
          { value: 'recurring', label: 'Increase recurring donations' },
          { value: 'major', label: 'Acquire major gifts' },
          { value: 'endowment', label: 'Build an endowment fund' },
          { value: 'program', label: 'Fund a specific program' },
          { value: 'retention', label: 'Improve donor retention' },
          { value: 'engagement', label: 'Increase donor engagement' },
          { value: 'awareness', label: 'Enhance public awareness' },
          { value: 'other', label: 'Other' }
        ],
        hasOther: true,
        max: 3,
        required: true
      },
      {
        id: 'ngoFundingTarget',
        text: 'What level of annual funding are you aiming to raise in 3 years?',
        type: 'radio',
        options: [
          { value: '10to50k', label: 'Increase to $10K-$50K annually' },
          { value: '50to100k', label: 'Increase to $50K-$100K annually' },
          { value: '100to500k', label: 'Increase to $100K-$500K annually' },
          { value: '500kto1m', label: 'Increase to $500K-$1M annually' },
          { value: 'over1m', label: 'Increase to over $1M annually' },
          { value: 'maintain', label: 'Maintain current funding level' },
          { value: 'notsure', label: 'Not sure/Defining goals' }
        ],
        required: true
      },
      {
        id: 'ngoFundingPriority',
        text: 'Which is more important to your NGO?',
        type: 'radio',
        options: [
          { value: 'shortterm', label: 'Short-term funding for immediate needs' },
          { value: 'longterm', label: 'Long-term funding for future stability' },
          { value: 'balance', label: 'Balance of both' }
        ],
        required: true
      },
      {
        id: 'ngoDonorRelationshipType',
        text: 'What type of relationship does your NGO ideally want with donors?',
        type: 'checkbox',
        options: [
          { value: 'transactional', label: 'Primarily transactional (one-time donations)' },
          { value: 'recurring', label: 'Focus on building recurring giving' },
          { value: 'engagement', label: 'Focus on deeper engagement and long-term relationships' },
          { value: 'major', label: 'Seeking major donors for significant gifts' },
          { value: 'broad', label: 'Engaging a broad base of smaller donors' },
          { value: 'partnerships', label: 'Partnerships with corporations or foundations' },
          { value: 'legacy', label: 'Legacy gifts and planned giving' }
        ],
        max: 2,
        required: true
      },
      {
        id: 'ngoRiskTolerance',
        text: "What is your NGO's risk tolerance for new fundraising strategies?",
        type: 'radio',
        options: [
          { value: 'riskaverse', label: 'Risk-averse' },
          { value: 'moderate', label: 'Moderately risk-tolerant' },
          { value: 'riskseeking', label: 'Risk-seeking' },
          { value: 'depends', label: 'Depends on strategy' }
        ],
        required: true
      },
      {
        id: 'ngoPreferredStrategies',
        text: 'Are there any specific fundraising strategies your NGO is interested in exploring?',
        type: 'textarea',
        maxLength: 500,
        required: false
      },
      {
        id: 'ngoAvoidStrategies',
        text: 'Are there any fundraising strategies that your NGO is not willing to consider?',
        type: 'textarea',
        maxLength: 500,
        required: false
      },
      {
        id: 'ngoAdditionalConsiderations',
        text: 'Any other important considerations or preferences regarding fundraising?',
        type: 'textarea',
        maxLength: 500,
        required: false
      }
    ]
  },
  {
    id: 'section9',
    title: 'Compliance & Registration Status',
    questions: [
      {
        id: 'ngoComplianceInProcess',
        text: 'Which registrations/certifications are you currently in the process of obtaining?',
        type: 'checkbox',
        options: [
          { value: '12a', label: 'Section 12A Registration' },
          { value: '80g', label: 'Section 80G Certification' },
          { value: 'darpan', label: 'NGO Darpan Enrollment' },
          { value: 'gst', label: 'GST Registration' },
          { value: 'fcra', label: 'FCRA Registration' },
          { value: '501c', label: '501(c) Registration' },
          { value: 'csr1', label: 'CSR-1 Registration' }
        ],
        required: false,
        conditionalQuestions: {
          fcra: [
            {
              id: 'ngoFCRAProcessStage',
              text: 'What stage is your FCRA application in?',
              type: 'radio',
              options: [
                { value: 'initial', label: 'Initial Documentation' },
                { value: 'submitted', label: 'Application Submitted' },
                { value: 'review', label: 'Under Review' },
                { value: 'additional', label: 'Additional Documentation Requested' }
              ],
              required: true
            }
          ],
          '501c': [
            {
              id: 'ngo501cProcessType',
              text: 'Which 501(c) registration are you applying for?',
              type: 'radio',
              options: [
                { value: '501c3', label: '501(c)(3) - Charitable Organization' },
                { value: '501c4', label: '501(c)(4) - Social Welfare Organization' },
                { value: 'other', label: 'Other' }
              ],
              required: true
            }
          ]
        }
      },
      {
        id: 'ngoAuditStatus',
        text: 'What is your current audit status?',
        type: 'radio',
        options: [
          { value: 'current', label: 'Up to date with all required audits' },
          { value: 'partial', label: 'Some audits pending' },
          { value: 'pending', label: 'Need to start audit process' }
        ],
        required: true
      },
      {
        id: 'ngoComplianceTeam',
        text: 'Do you have dedicated staff/consultants for compliance management?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'outsourced', label: 'Outsourced to consultants' }
        ],
        required: true
      },
      {
        id: 'ngoForeignComplianceReadiness',
        text: 'Rate your readiness for foreign funding compliance requirements:',
        type: 'rating',
        subQuestions: [
          { id: 'docPreparation', text: 'Documentation Preparation' },
          { id: 'reportingCapacity', text: 'Reporting & Monitoring Capacity' },
          { id: 'bankAccounts', text: 'Designated Bank Account Management' },
          { id: 'complianceTracking', text: 'Compliance Tracking & Updates' }
        ],
        required: true
      }
    ]
  }
];