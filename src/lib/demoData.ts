export const demoFeed = [
  {
    id:'demo-farmer', type:'product', title:'Organic tomatoes harvested this morning',
    description:'Family-grown produce from Kosovo. Fresh weekly harvests for restaurants, shops and households.',
    thumbnail_url:'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=86',
    like_count:1842, comment_count:96,
    author:{full_name:'Arben Krasniqi',title:'Organic Farmer · Prizren',verified:true,avatar_url:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85'}
  },
  {
    id:'demo-welder', type:'hire_me', title:'Custom steel staircase — built from sketch to install',
    description:'Welding, fabrication and on-site installation for homes, restaurants and commercial projects.',
    thumbnail_url:'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=86',
    like_count:963, comment_count:41,
    author:{full_name:'Luan Berisha',title:'Welder & Metal Fabricator · Stuttgart',verified:true,avatar_url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=85'}
  },
  {
    id:'demo-hair', type:'service', title:'Soft balayage transformation in 90 seconds',
    description:'Colour, cut and styling appointments. Watch my work before you book.',
    thumbnail_url:'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=86',
    like_count:3124, comment_count:177,
    author:{full_name:'Mia Santos',title:'Hair Colourist · Lisbon',verified:true,avatar_url:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85'}
  },
  {
    id:'demo-dev', type:'pitch', title:'I built an AI booking assistant for independent hotels',
    description:'Prototype live. Looking for pilot hotels and one technical co-founder.',
    thumbnail_url:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=86',
    like_count:2240, comment_count:203,
    author:{full_name:'Noah Klein',title:'Full-stack Developer · Berlin',verified:true,avatar_url:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85'}
  },
  {
    id:'demo-teacher', type:'teach', title:'Learn conversational English for hospitality work',
    description:'Practical 20-minute lessons built for hotel, restaurant and tourism teams.',
    thumbnail_url:'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=86',
    like_count:1288, comment_count:64,
    author:{full_name:'Sara Ahmed',title:'English Teacher · London',verified:true,avatar_url:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85'}
  },
  {
    id:'demo-maker', type:'product', title:'Handmade oak desk — made to your dimensions',
    description:'Solid wood furniture designed and built in my workshop. Worldwide enquiries welcome.',
    thumbnail_url:'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=86',
    like_count:1766, comment_count:72,
    author:{full_name:'Marco Bianchi',title:'Furniture Maker · Florence',verified:true,avatar_url:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=85'}
  }
];

export const demoMarket = [
  {id:'m1',type:'service',title:'Brand identity + launch kit',price:480,currency:'EUR',thumbnail_url:demoFeed[3].thumbnail_url,seller:{full_name:'Noah Klein',title:'Product builder',verified:true,rating:4.9,review_count:83}},
  {id:'m2',type:'product',title:'Weekly organic vegetable box',price:34,currency:'EUR',thumbnail_url:demoFeed[0].thumbnail_url,seller:{full_name:'Arben Krasniqi',title:'Organic farmer',verified:true,rating:4.8,review_count:126}},
  {id:'m3',type:'service',title:'Balayage + cut + styling',price:110,currency:'EUR',thumbnail_url:demoFeed[2].thumbnail_url,seller:{full_name:'Mia Santos',title:'Hair colourist',verified:true,rating:5.0,review_count:214}},
  {id:'m4',type:'teach',title:'English for hospitality — 4 lessons',price:59,currency:'EUR',thumbnail_url:demoFeed[4].thumbnail_url,seller:{full_name:'Sara Ahmed',title:'English teacher',verified:true,rating:4.9,review_count:95}},
  {id:'m5',type:'service',title:'Custom steel fabrication quote',price:150,currency:'EUR',thumbnail_url:demoFeed[1].thumbnail_url,seller:{full_name:'Luan Berisha',title:'Welder',verified:true,rating:4.9,review_count:68}},
  {id:'m6',type:'product',title:'Custom solid oak desk',price:690,currency:'EUR',thumbnail_url:demoFeed[5].thumbnail_url,seller:{full_name:'Marco Bianchi',title:'Furniture maker',verified:true,rating:4.8,review_count:142}}
];