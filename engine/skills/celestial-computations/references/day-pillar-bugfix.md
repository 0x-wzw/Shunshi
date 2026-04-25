# Day Pillar Calculation Bug Fix

## Bug in `celestial_computations/logos.py`

The `_calculate_day_pillar` method uses a Julian Day formula that applies 
month-shifting (`if month <= 2: year -= 1; month += 12`) which is part of
the *Julian calendar* JD computation, but then subtracts 11 as if computing
from the standard Gregorian JDN. These two approaches are incompatible.

## Fix Required

Replace the `_calculate_day_pillar` method in `logos.py` with:

```python
def _calculate_day_pillar(self, year: int, month: int, day: int):
    """
    Calculate day pillar using the JDN (Julian Day Number) formula.
    Formula: dayIndex = (JDN - 11) % 60, where index 0 = 甲子 (Jia Zi).
    
    This is the most reliable method — derived from the known mapping 
    JDN 0 → 壬子 (index 49), so offset = (0 - 49) % 60 = 11.
    Equivalently: (JDN + 49) % 60 since -11 ≡ 49 (mod 60).
    
    DO NOT use anchor dates like "Jan 1, 1900 = 甲辰" — multiple sources
    conflict on that reference. The JDN formula is self-consistent.
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
```

## Old (Buggy) Code

```python
def _calculate_day_pillar(self, year: int, month: int, day: int):
    if month <= 2:
        year -= 1
        month += 12
    A = year // 100
    B = 2 - A + A // 4
    JD = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + B - 1524
    day_offset = (JD - 11) % 60
    return (
        CelestialConstants.HEAVENLY_STEMS[day_offset % 10],
        CelestialConstants.EARTHLY_BRANCHES[day_offset % 12]
    )
```

The issue: The `if month <= 2: year -= 1; month += 12` transformation 
converts the year/month into a form suitable for the Julian calendar JD 
formula (the one with 365.25* and 30.6001*), which is a DIFFERENT formula
from the standard Gregorian JDN formula. The `- 11` offset was calibrated
for the standard Gregorian JDN, not for this Julian-style JD computation.

## Also Fix in SKILL.md

The SKILL.md previously stated "Jan 1, 1900 was 甲辰 (index 40)" as the
reference point. This is UNRELIABLE — multiple Chinese calendar sources 
conflict on this date. The JDN formula `(JDN - 11) % 60` is the correct
self-consistent approach.

This has already been corrected in SKILL.md as of 2026-04-16.