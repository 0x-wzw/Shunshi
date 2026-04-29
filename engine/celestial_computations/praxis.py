"""
Praxis: Operational Interface
"""

import json
import argparse
from datetime import datetime
from typing import Dict, List, Optional

from .aether import CelestialConstants
from .logos import BaziCalculator, SolarTermCalculator, PlanetaryEphemeris
from .harmon import BaziAnalyzer
from .hexagram_calculator import HexagramCalculator, HEXAGRAM_BY_NUMBER

class CelestialAgent:
    def __init__(self):
        self.bazi_calc = BaziCalculator()
        self.solar_calc = SolarTermCalculator()
        self.planet_calc = PlanetaryEphemeris()
        self.analyzer = BaziAnalyzer()
        self.hex_calc = HexagramCalculator()
    
    def bazi_chart(self, year: int, month: int, day: int, hour: int = 12):
        pillars = self.bazi_calc.calculate(year, month, day, hour)
        analysis = self.analyzer.analyze_chart(pillars)
        return {"pillars": pillars.to_dict(), "analysis": analysis}
    
    def hexagram_reading(self, num: int, moving_lines=None):
        h = HEXAGRAM_BY_NUMBER[num]
        opp = self.hex_calc.opposite(num)
        nuc = self.hex_calc.nuclear(num)
        result = {
            "original": {
                "number": num,
                "name": f"{h.name_cn} ({h.name_en})",
                "binary": h.binary,
                "symbol": h.symbol,
                "upper": h.upper_trigram.name_cn,
                "lower": h.lower_trigram.name_cn,
            },
            "opposite": {
                "number": opp.number,
                "name": f"{opp.name_cn} ({opp.name_en})",
                "binary": opp.binary,
            },
            "nuclear": {
                "number": nuc.number,
                "name": f"{nuc.name_cn} ({nuc.name_en})",
                "binary": nuc.binary,
            },
        }
        if moving_lines:
            chg = self.hex_calc.changed(num, moving_lines)
            result["changed"] = {
                "number": chg.number,
                "name": f"{chg.name_cn} ({chg.name_en})",
                "binary": chg.binary,
                "moving_lines": moving_lines,
            }
        return result
    
    def planetary_report(self, dt=None):
        if dt is None:
            dt = datetime.utcnow()
        return {"timestamp": dt.isoformat(), "note": "Celestial mechanics ready"}

    # ── New Hexagram API ───────────────────────────────────────

    def get_hexagram(self, number: int):
        h = HEXAGRAM_BY_NUMBER[number]
        return {
            "number": h.number,
            "name": f"{h.name_cn} ({h.name_en})",
            "binary": h.binary,
            "symbol": h.symbol,
            "upper": h.upper_trigram.name_cn,
            "lower": h.lower_trigram.name_cn,
            "gua_ci": h.gua_ci,
        }

    def hexagram_relations(self, number: int):
        return self.hex_calc.hexagram_relationships(number)

    def hexagram_from_day_pillar(self, day_stem: str, day_branch: str):
        return self.hex_calc.day_pillar_report(day_stem, day_branch)

    def all_hexagrams(self):
        return [h.to_dict() for h in self.hex_calc.all_64_hexagrams()]

class ResultFormatter:
    @staticmethod
    def format_bazi(chart: Dict):
        p = chart["pillars"]
        lines = [
            "╔══════════════════════════════════════════════════════════╗",
            "║            BAZI CHART (八字)                               ║",
            "╠══════════════════════════════════════════════════════════╣",
            f"║  Year:  {p['year']:<50}          ║",
            f"║  Month: {p['month']:<50}          ║",
            f"║  Day:   {p['day']:<50}          ║",
            f"║  Hour:  {p['hour']:<50}          ║",
            "╚══════════════════════════════════════════════════════════╝",
        ]
        return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser(description="Astrum Harmonis Celestialis")
    parser.add_argument("command", choices=["bazi", "hexagram", "planetary", "now", "report"])
    parser.add_argument("args", nargs="*")
    parser.add_argument("--json", "-j", action="store_true")
    
    args = parser.parse_args()
    agent = CelestialAgent()
    formatter = ResultFormatter()
    
    if args.command == "bazi" and len(args.args) >= 3:
        year, month, day = map(int, args.args[:3])
        hour = int(args.args[3]) if len(args.args) > 3 else 12
        result = agent.bazi_chart(year, month, day, hour)
        print(json.dumps(result, indent=2) if args.json else formatter.format_bazi(result))
    
    elif args.command == "hexagram" and args.args:
        result = agent.hexagram_reading(int(args.args[0]))
        print(json.dumps(result, indent=2))
    
    else:
        print("Usage: python -m celestial_computations bazi YEAR MONTH DAY [HOUR]")

if __name__ == "__main__":
    main()
