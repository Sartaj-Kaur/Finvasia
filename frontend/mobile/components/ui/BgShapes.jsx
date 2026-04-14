import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * BgShapes — Decorative geometric blobs for screen backgrounds.
 * Colors use hex with alpha for guaranteed visibility across dark + white BGs.
 * pointerEvents="none" ensures shapes never block user interactions.
 */
export function BgShapes({ variant = 'home' }) {
  const configs = {
    // Home: sits inside dark teal container, shapes need to pop on dark bg
    home: [
      { size: 280, top: -100, right: -80,  color: '#A58BFA55', radius: 140 }, // lavender top-right
      { size: 200, top:  -40, left:  -80,  color: '#34D39940', radius: 100 }, // mint top-left
      { size: 160, top:  260, right: -50,  color: '#A58BFA40', radius: 80  }, // lavender mid-right
      { size: 220, top:  340, left:  -70,  color: '#10B98135', radius: 110 }, // green mid-left
      { size: 130, top:  500, right:  60,  color: '#34D39945', radius: 65  }, // mint center-right
      { size: 180, top:  600, left:  -30,  color: '#A58BFA35', radius: 90  }, // lavender lower-left
      { size: 110, top:  700, right:  -20, color: '#10B98130', radius: 55  }, // green lower-right
    ],
    // Activity: white bg — use more opaque, deeper color variants
    activity: [
      { size: 300, top: -110, left:  -90,  color: '#A58BFA30', radius: 150 },
      { size: 160, top:  80,  right: -50,  color: '#34D39940', radius: 80  },
      { size: 120, top:  240, left:   30,  color: '#10B98130', radius: 60  },
      { size: 200, top:  480, right: -60,  color: '#A58BFA28', radius: 100 },
      { size: 140, top:  600, left:  -40,  color: '#34D39938', radius: 70  },
    ],
    // Scan: white bg
    scan: [
      { size: 260, top: -80,  right: -70,  color: '#10B98135', radius: 130 },
      { size: 150, top:  60,  left:  -50,  color: '#A58BFA38', radius: 75  },
      { size: 100, top:  220, right:  50,  color: '#34D39940', radius: 50  },
      { size: 180, top:  450, left:  -40,  color: '#A58BFA30', radius: 90  },
      { size: 120, top:  560, right: -30,  color: '#10B98128', radius: 60  },
    ],
    // Profile: white bg
    profile: [
      { size: 280, top: -100, right: -80,  color: '#34D39933', radius: 140 },
      { size: 130, top:   50, right:  50,  color: '#A58BFA40', radius: 65  },
      { size: 180, top:  -20, left:  -60,  color: '#10B98130', radius: 90  },
      { size: 150, top:  350, right: -40,  color: '#34D39938', radius: 75  },
      { size: 110, top:  500, left:   20,  color: '#A58BFA30', radius: 55  },
    ],
    // Auth: for login/register screens
    auth: [
      { size: 320, top: -120, left: -100, color: '#A58BFA40', radius: 160 },
      { size: 240, bottom: -60, right: -60, color: '#34D39935', radius: 120 },
      { size: 160, top: '40%', right: -40, color: '#A58BFA30', radius: 80 },
      { size: 200, bottom: '20%', left: -50, color: '#10B98125', radius: 100 },
    ],
  };

  const shapes = configs[variant] || configs.home;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {shapes.map((sh, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width:  sh.size,
            height: sh.size,
            borderRadius: sh.radius,
            backgroundColor: sh.color,
            top:    sh.top,
            left:   sh.left,
            right:  sh.right,
            bottom: sh.bottom,
          }}
        />
      ))}
    </View>
  );
}
