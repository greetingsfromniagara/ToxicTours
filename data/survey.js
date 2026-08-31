window.TOXIC_TOUR_STOPS.push({
  id: '1985-survey',
  number: 11,
  title: 'The 1985 Survey',
  kicker: 'When ordinary roads and driveways became the evidence',
  corridor: 'survey',
  location: 'Multiple documented locations · Niagara Falls region',
  duration: 'Optional historical hotspot loop',
  multiLocation: true,
  summary: 'A mobile gamma scan in October 1984 identified 100 elevated-radiation anomalies across Niagara Falls and the surrounding area. Oak Ridge crews returned July 15–17, 1985 to measure them on the ground — revealing how radioactive material had become embedded in roadsides, gravel, driveways, parking lots and ditches.',
  body: [
    'The survey began with a specific question: were elevated readings tracing routes used to carry radioactive waste to the Lake Ontario Ordnance Works? The answer split the 100 anomalies into two very different histories.',
    'Thirty-eight locations exceeded FUSRAP remedial-action guidelines: 35 along Pletcher and Old Pletcher roads, plus three other anomalies at former Routes 18/104, Military Road near Route 31, and Buffalo Avenue near Hyde Park Boulevard. The report states that those 38 locations were remediated and material above the applicable guidelines was removed.',
    'The other 62 anomalies were classified by Oak Ridge as unrelated to NFSS transport material. Investigators repeatedly found a porous radioactive slag beneath asphalt, in gravel driveways, parking areas and general fill. The 1986 report attributed these particular anomalies to phosphate-furnace slag associated with elemental-phosphorus production using uranium-bearing raw materials, reportedly from the former Oldbury Furnace.',
    'That historical classification does not mean every radioactive-fill problem later found in Niagara came from Oldbury. The broader record developed in later investigations includes other industrial slag producers, haulers, dumps and reuse pathways. What the 1985 survey proved beyond doubt is the mechanism: industrial radioactive material could be treated like ordinary aggregate, moved away from a factory, and disappear beneath the built landscape.'
  ],
  callout: 'The hotspot was often not a spill. It was the roadbed.',
  lookFor: 'Notice the recurring settings in the survey record: asphalt edges, gravel driveways, parking lots, culverts and roadside ditches. These are historical locations, not instructions to enter private property or search for contamination today.',
  backgroundReading: 9,
  hotspots: [
    {
      anomaly: '#43',
      location: '738 Upper Mountain Road · Lewiston',
      mapQuery: '738 Upper Mountain Road Lewiston NY',
      reading: 710,
      note: 'Highest surface gamma exposure rate in the 1985 survey. The elevated strip was about 10 ft wide by 59 ft long along a ditch and gravel driveway. A soil sample contained up to 70 pCi/g uranium-238 and 560 pCi/g thorium-232.'
    },
    {
      anomaly: '#23',
      location: 'South side of Pletcher Road · 8,960 ft east of Creek Road',
      reading: 230,
      note: 'Highest surface reading along the surveyed Pletcher Road route. The same anomaly produced the report’s highest Pletcher Road radium-226 soil result: 430 pCi/g. This was among the Pletcher Road locations the report says were remediated.'
    },
    {
      anomaly: '#81',
      location: '6901 Buffalo Avenue · Niagara Falls',
      mapQuery: '6901 Buffalo Avenue Niagara Falls NY',
      reading: 160,
      note: 'Maximum surface reading reported within the Niagara Falls group, measured on a gravel driveway. Sampling at this anomaly included uranium-238 up to 52 pCi/g.'
    },
    {
      anomaly: '#63',
      location: 'Near 3060 Grand Island Boulevard · Grand Island',
      mapQuery: '3060 Grand Island Boulevard Grand Island NY',
      reading: 160,
      note: 'The maximum was measured in a culvert northeast of the address. Soil sampled at this anomaly contained elevated radium-226, uranium-238 and thorium-232.'
    },
    {
      anomaly: '#52',
      location: '2924 Military Road · Niagara Falls',
      mapQuery: '2924 Military Road Niagara Falls NY',
      reading: 140,
      note: 'Measured at the southwest corner of an asphalt driveway. The report identified this as one of five anomalies associated with slag containing elevated thorium.'
    }
  ],
  sources: [
    { label: 'DOE / Oak Ridge National Laboratory — Results of radiological measurements taken in the Niagara Falls, New York, area (ORNL/TM-10076)', url: 'https://lmpublicsearch.lm.doe.gov/lmsites/2726-ny.17-10.pdf' },
    { label: 'EPA HERO — report abstract and survey summary', url: 'https://hero.epa.gov/reference/9042754/' },
    { label: 'Investigative Post — Radioactive hotspots dot Niagara County', url: 'https://www.btpm.org/investigative-post/2016-07-06/investigative-post-radioactive-hotspots-dot-niagara-county' },
    { label: 'Investigative Post — Radioactive contamination more widespread than previously thought', url: 'https://www.btpm.org/investigative-post/2017-02-09/investigative-post-radioactive-contamination-more-widespread-than-previously-thought' }
  ]
});
