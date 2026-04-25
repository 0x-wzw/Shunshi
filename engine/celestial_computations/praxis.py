"""
Praxis: Operational Interface
"""

import json
import argparse
from datetime import datetime
from typing import Dict, List, Optional

from .aether import CelestialConstants
from .logos import BaziCalculator, SolarTermCalculator, PlanetaryEphemeris
from .harmon import BaziAnalyzer, HexagramRelations

class CelestialAgent:
    def __init__(self):
        self.bazi_calc = BaziCalculator()
        self.solar_calc = SolarTermCalculator()
        self.planet_calc = PlanetaryEphemeris()
        self.analyzer = BaziAnalyzer()
        self.hexagram = HexagramRelations()
    
    def bazi_chart(self, year: int, month: int, day: int, hour: int = 12):
        pillars = self.bazi_calc.calculate(year, month, day, hour)
        analysis = self.analyzer.analyze_chart(pillars)
        return {"pillars": pillars.to_dict(), "analysis": analysis}
    
    def hexagram_reading(self, num: int, moving_lines=None):
        return {
            "original": {"number": num, "name": self.hexagram.get_hexagram_name(num), "binary": self.hexagram.hexagram_to_binary(num)},
            "opposite": {"number": self.hexagram.get_opposite_hexagram(num), "name": self.hexagram.get_hexagram_name(self.hexagram.get_opposite_hexagram(num))},
        }
    
    def planetary_report(self, dt=None):
        if dt is None:
            dt = datetime.utcnow()
        return {"timestamp": dt.isoformat(), "note": "Celestial mechanics ready"}

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
