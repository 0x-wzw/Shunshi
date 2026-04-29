"""
Logos: Mathematical and Astronomical Algorithms
"""

import math
from datetime import datetime, timedelta
from typing import Tuple, Dict, List, Optional
from dataclasses import dataclass

try:
    from skyfield.api import Loader, Topos
    SKYFIELD_AVAILABLE = True
except ImportError:
    SKYFIELD_AVAILABLE = False

from .aether import CelestialConstants, HeavenlyStems, EarthlyBranches

@dataclass
class FourPillars:
    year_pillar: Tuple
    month_pillar: Tuple
    day_pillar: Tuple
    hour_pillar: Tuple
    day_master: any
    
    def to_dict(self):
        return {
            "year": f"{self.year_pillar[0].character}{self.year_pillar[1].character}",
            "month": f"{self.month_pillar[0].character}{self.month_pillar[1].character}",
            "day": f"{self.day_pillar[0].character}{self.day_pillar[1].character}",
            "hour": f"{self.hour_pillar[0].character}{self.hour_pillar[1].character}",
            "day_master": f"{self.day_master.character} ({self.day_master.element.name})",
        }

class BaziCalculator:
    def __init__(self):
        self.skyfield_available = SKYFIELD_AVAILABLE
    
    def calculate(self, year: int, month: int, day: int, hour: int = 12):
        year_stem, year_branch = self._calculate_year_pillar(year)
        month_stem, month_branch = self._calculate_month_pillar(year, month)
        day_stem, day_branch = self._calculate_day_pillar(year, month, day)
        hour_stem, hour_branch = self._calculate_hour_pillar(day_stem, hour)
        
        return FourPillars(
            year_pillar=(year_stem, year_branch),
            month_pillar=(month_stem, month_branch),
            day_pillar=(day_stem, day_branch),
            hour_pillar=(hour_stem, hour_branch),
            day_master=day_stem
        )
    
    def _calculate_year_pillar(self, year: int):
        stem_idx = (year - 4) % 10
        branch_idx = (year - 4) % 12
        return (
            CelestialConstants.HEAVENLY_STEMS[stem_idx],
            CelestialConstants.EARTHLY_BRANCHES[branch_idx]
        )
    
    def _calculate_month_pillar(self, year: int, month: int):
        """month is Gregorian (1=January). Internally converts to Chinese zodiac month (1=寅)."""
        zodiac_month = (month - 2) % 12 + 1  # Feb→1(寅), May→4(巳), Jan→12(丑)
        branch_idx = (zodiac_month + 1) % 12
        year_stem_idx = (year - 4) % 10
        month_stem_base = {0: 2, 1: 4, 2: 0, 3: 6, 4: 3}
        stem_idx = (month_stem_base.get(year_stem_idx % 5, 0) + zodiac_month - 1) % 10
        return (
            CelestialConstants.HEAVENLY_STEMS[stem_idx],
            CelestialConstants.EARTHLY_BRANCHES[branch_idx]
        )
    
    def _calculate_day_pillar(self, year: int, month: int, day: int):
        """
        Calculate day pillar using the standard Gregorian JDN formula.
        Formula: dayIndex = (JDN - 11) % 60, where index 0 = 甲子 (Jia Zi).

        This is the most reliable method — derived from the known mapping 
        JDN 0 → 壬子 (index 49), so offset = (0 - 49) % 60 = 11.
        Equivalently: (JDN + 49) % 60 since -11 ≡ 49 (mod 60).

        Reference: Fliegel & Van Flandern algorithm for Gregorian JDN.
        """
        a = (14 - month) // 12
        y = year + 4800 - a
        m = month + 12 * a - 3
        jdn = day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045

        day_offset = (jdn - 11) % 60
        return (
            CelestialConstants.HEAVENLY_STEMS[day_offset % 10],
            CelestialConstants.EARTHLY_BRANCHES[day_offset % 12]
        )
    
    def _calculate_hour_pillar(self, day_stem, hour: int):
        branch_idx = (hour + 1) // 2 % 12
        hour_stem_start = {0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 0, 6: 2, 7: 4, 8: 6, 9: 8}
        start_idx = hour_stem_start.get(day_stem.index, 0)
        hour_stem_idx = (start_idx + branch_idx) % 10
        return (
            CelestialConstants.HEAVENLY_STEMS[hour_stem_idx],
            CelestialConstants.EARTHLY_BRANCHES[branch_idx]
        )

class SolarTermCalculator:
    """
    24 Solar Terms (二十四节气) calculations using astronomical algorithms.
    Solar terms are based on ecliptic longitude of the sun, not dates.
    """
    # Ecliptic longitudes for the 24 solar terms (starting from Start of Spring)
    # Each major term is 15° apart, minor terms are in between
    SOLAR_LONGITUDES = [
        315,  # Start of Spring (立春) - index 0, around Feb 4
        330,  # Rain Water (雨水)
        345,  # Awakening of Insects (惊蛰)
        0,    # Spring Equinox (春分) - 0° = 360°
        15,   # Clear and Bright (清明)
        30,   # Grain Rain (谷雨)
        45,   # Start of Summer (立夏)
        60,   # Grain Full (小满)
        75,   # Grain in Ear (芒种)
        90,   # Summer Solstice (夏至)
        105,  # Minor Heat (小暑)
        120,  # Major Heat (大暑)
        135,  # Start of Autumn (立秋)
        150,  # Limit of Heat (处暑)
        165,  # White Dew (白露)
        180,  # Autumn Equinox (秋分)
        195,  # Cold Dew (寒露)
        210,  # Frost Descent (霜降)
        225,  # Start of Winter (立冬)
        240,  # Minor Snow (小雪)
        255,  # Major Snow (大雪)
        270,  # Winter Solstice (冬至)
        285,  # Minor Cold (小寒)
        300,  # Major Cold (大寒)
    ]
    
    # Zodiac month mapping (simplified - actual boundaries vary by year)
    ZODIAC_MONTHS = {
        0: (2, 4),   # Tiger: starts at Start of Spring
        1: (3, 5),   # Rabbit: starts around Mar 5
        2: (4, 5),   # Dragon: starts around Apr 5
        3: (5, 6),   # Snake: starts around May 5
        4: (6, 7),   # Horse: starts around Jun 6
        5: (7, 8),   # Goat: starts around Jul 7
        6: (8, 10),  # Monkey: starts around Aug 7
        7: (9, 11),  # Rooster: starts around Sep 7
        8: (10, 11), # Dog: starts around Oct 8
        9: (11, 11), # Pig: starts around Nov 7
        10: (12, 1), # Rat: starts around Dec 7
        11: (1, 2),  # Ox: starts around Jan 6
    }
    
    def get_current_solar_term(self, dt):
        """
        Get current solar term based on sun's ecliptic longitude.
        Solar terms are 15° apart, starting at 315° (Start of Spring).
        """
        # Calculate approximate solar longitude
        # Formula: longitude = (280.460 + 0.9856474 * n) % 360 where n is days from J2000.0
        # Simplified: longitude ≈ (DOY * 0.9856) offset to align with solar terms
        doy = dt.timetuple().tm_yday
        
        # More accurate approximation: longitude on Jan 1 is about 280°
        # Major Cold (大寒) is at 300°, around Jan 20
        # So we need to find which term the current longitude falls into
        
        # Calculate solar longitude (simplified Meeus algorithm)
        n = doy - 1  # Day number from start of year (0-indexed)
        solar_long = (280.460 + 0.9856474 * n) % 360
        
        # Convert to term index: each term is 15°
        # Start of Spring (立春) is at 315°
        # Index 0 is Major Cold at 300°
        # Index 1 is Start of Spring at 315°
        # etc.
        
        # Find which term we're past
        term_index = 0
        for i, long in enumerate(self.SOLAR_LONGITUDES):
            if solar_long < long:
                term_index = i - 1
                break
        else:
            term_index = len(self.SOLAR_LONGITUDES) - 1
            
        # Handle wraparound
        if term_index < 0:
            term_index = len(self.SOLAR_LONGITUDES) - 1
            
        return CelestialConstants.SOLAR_TERMS[term_index], term_index
    
    def get_zodiac_month(self, dt):
        """
        Get current Chinese zodiac month (animal) from solar term.
        """
        term_idx = self.get_current_solar_term(dt)[1]
        # Map term index to branch (simplified)
        branch_idx = term_idx // 2
        return CelestialConstants.EARTHLY_BRANCHES[branch_idx]

class PlanetaryEphemeris:
    """
    Planetary ephemeris calculations using Skyfield.
    Downloads DE440 ephemeris data from NASA JPL for modern precision.
    """
    def __init__(self):
        self.ts = None
        self.planets = None
        self.eph = None
        self._init_skyfield()
    
    def _init_skyfield(self):
        """Initialize Skyfield with DE440 ephemeris."""
        try:
            from skyfield.api import Loader
            load = Loader('/tmp/skyfield_data')
            self.eph = load('de440.bsp')  # Modern JPL ephemeris (2020-2050)
            self.ts = load.timescale()
            self.planets = {
                'sun': self.eph['sun'],
                'moon': self.eph['moon'],
                'mercury': self.eph['mercury'],
                'venus': self.eph['venus'],
                'mars': self.eph['mars barycenter'],
                'jupiter': self.eph['jupiter barycenter'],
                'saturn': self.eph['saturn barycenter'],
            }
        except Exception as e:
            self.planets = None
            print(f"Skyfield initialization error: {e}")
    
    def get_planet_positions(self, dt):
        """Get ecliptic longitudes for all planets."""
        if self.planets is None:
            return {"status": "Skyfield not initialized"}
        
        from skyfield.api import Topos
        earth = self.eph['earth']
        t = self.ts.utc(dt.year, dt.month, dt.day, dt.hour, dt.minute)
        
        positions = {}
        for name, planet in self.planets.items():
            try:
                astrometric = earth.at(t).observe(planet)
                app = astrometric.apparent()
                lat, lon, dist = app.ecliptic_latlon(epoch=None)
                positions[name] = {
                    'longitude': lon.degrees,
                    'latitude': lat.degrees,
                    'distance_au': dist.au,
                }
            except Exception as e:
                positions[name] = {'error': str(e)}
        
        return {"timestamp": dt.isoformat(), "positions": positions}
    
    def get_lunar_phase(self, dt):
        """Calculate lunar phase and related data."""
        if self.eph is None:
            return {"phase": "Skyfield not available"}
        
        try:
            from skyfield import almanac
            t = self.ts.utc(dt.year, dt.month, dt.day, dt.hour, dt.minute)
            phase, phase_details = almanac.moon_phases(self.eph).at(t)
            
            # Calculate phase percentage (0-100%)
            earth = self.eph['earth']
            moon = self.eph['moon']
            sun = self.eph['sun']
            
            # Get ecliptic longitudes
            moon_lon = earth.at(t).observe(moon).apparent().ecliptic_latlon(epoch=None)[1].degrees
            sun_lon = earth.at(t).observe(sun).apparent().ecliptic_latlon(epoch=None)[1].degrees
            
            # Phase angle (0 = new moon, 180 = full moon)
            phase_angle = (moon_lon - sun_lon) % 360
            
            return {
                "phase_name": self._phase_name(phase_angle),
                "phase_angle": round(phase_angle, 2),
                "illumination_percent": round(50 * (1 + math.cos(math.radians(phase_angle))), 1),
                "is_new_moon": phase_angle < 10 or phase_angle > 350,
                "is_full_moon": abs(phase_angle - 180) < 10,
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _phase_name(self, angle):
        """Return phase name based on angle."""
        if angle < 22.5: return "New Moon"
        elif angle < 67.5: return "Waxing Crescent"
        elif angle < 112.5: return "First Quarter"
        elif angle < 157.5: return "Waxing Gibbous"
        elif angle < 202.5: return "Full Moon"
        elif angle < 247.5: return "Waning Gibbous"
        elif angle < 292.5: return "Last Quarter"
        elif angle < 337.5: return "Waning Crescent"
        return "New Moon"

class LunarCalculator:
    def __init__(self):
        pass
    
    def get_lunar_date(self, gregorian_date: datetime):
        return {"day": 1, "phase_percent": 50}
