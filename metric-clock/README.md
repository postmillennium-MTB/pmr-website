# Analogue Metric Clock

Companion document for [`/metric-clock/`](https://www.postmillenniumrenaissance.com/metric-clock/), a live analogue clock face for decimal time. The page in this folder is a thin wrapper; the clock itself is a single self-contained HTML file hosted at <https://postmillennium-mtb.github.io/metric-clock/>.

> **Status: working draft.** The arithmetic below was checked against the clock's own source and by calculation. The historical notes are recalled, not re-checked against primary sources, and are marked **[R]**.

## What it shows

One day is split into **10 metric hours**, each of **100 metric minutes**, each of **100 metric seconds**: 100,000 metric seconds per day, against 86,400 standard seconds.

| Unit | Metric | Standard equivalent |
|---|---|---|
| Metric second | 1/100,000 of a day | 0.864 s |
| Metric minute (100 metric s) | 1/1,000 of a day | 86.4 s (1 min 26.4 s) |
| Metric hour (100 metric min) | 1/10 of a day | 2 h 24 min |

The dial has ten numerals (1 to 10, 36 degrees apart) with 10 at the top. A metric second is about 14% shorter than a standard second, so the second hand moves a little faster than a normal one.

### How the code works

1. Read the local time and take the real milliseconds elapsed since local midnight.
2. Multiply by 100,000 / 86,400 to get metric seconds since midnight.
3. Hour hand: one full turn per day (360 degrees x fraction of the day). Minute hand: one turn per metric hour (10 per day). Second hand: one turn per metric minute (1,000 per day).
4. The seconds keep their decimal remainder, so the second hand sweeps instead of ticking.

Because the hour hand turns once a day, it moves exactly like the hour hand of a 24-hour analogue clock.

## Can metric time and regular time ever match?

Short answer: **midnight, and only midnight.** The rest depends on what "match" means.

**1. The digits (00:00:00 and nothing else).** Both clocks count up from midnight, so both read `00:00:00` then. After that the readings diverge, and they never meet again before the day ends. Compare the share of the day that each digit stands for. A metric hour (10% of a day) is bigger than a standard hour (4.17%), and a metric minute (0.1%) is bigger than a standard minute (0.069%). Only the seconds run the other way: a metric second (0.001%) is smaller than a standard one (0.00116%). The most the seconds can fall short is 59 x 0.00000157 = 0.0000926 of a day (a reading of :59), while a single minute already adds 0.000306 of a day in the metric clock's favour. So for any nonzero hours or minutes the metric reading is further along the day, and with both at zero a nonzero seconds count only makes the metric reading *earlier* by a hair (standard 00:00:59 is 59 s in; metric 00:00:59 is 51 s in), never equal. Equality of all digits holds only at 00:00:00.

**2. The same fraction of the day (always).** Any time of day is the same fraction on both clocks. Noon is half a day on both: 12:00:00 standard is **5:00:00** metric. 6:00 is a quarter day, 2:50:00 metric. Metric time is just the decimal-day fraction with the digits grouped differently.

**3. The hands pointing the same way.** Treat the standard clock as a normal 12-hour dial and compare hand angles with the metric dial. Relative turns per day:

| Hands compared | Standard turns/day | Metric turns/day | Aligned (per day) | Every |
|---|---|---|---|---|
| Hour | 2 | 1 | 1 (midnight) | 24 h |
| Minute | 24 | 10 | 14 | 1 h 42 min 51.4 s |
| Second | 1,440 | 1,000 | 440 | 196.36 s (3 min 16.4 s) |

The number of alignments per day is the difference in turns per day.

- **Minute hands** line up when the fraction of the day is a multiple of 1/14: 00:00:00, 01:42:51, 03:25:43, 05:08:34, 06:51:26, 08:34:17, 10:17:09, **12:00:00**, 13:42:51, 15:25:43, 17:08:34, 18:51:26, 20:34:17, 22:17:09 (14 in all).
- **All three hands at once** needs the hour hands to align, which only happens at **midnight**. So the full "snap" only happens once a day.
- **Noon is a near miss.** At 12:00:00 the minute hands and the second hands both point straight up on both clocks, but the metric hour hand points at 5 (straight down), because it has done half a turn while the standard hour hand has done a full one on a 12-hour dial. If you compare against a 24-hour dial instead, the hour hands match all day long, and noon is a full match.

## Interesting details

- **Metric minute = Swatch .beat.** Swatch Internet Time (1998) split the day into 1,000 ".beats" on a single global clock (Biel Mean Time, UTC+1), with no time zones **[R]**. One .beat is 86.4 s, the same length as a metric minute. Metric time of day in minutes is the beat count, only offset by time zone.
- **Metric hour = 2 h 24 min.** Memorable benchmarks: metric 1:00 is 02:24, 2:50 is 06:00, 5:00 is noon, 7:50 is 18:00.
- **French Revolution origin [R].** Decimal time was decreed in 1793 as part of the Revolution's metric reforms and made compulsory in the civil sphere, but was suspended in 1795 after a short run, largely because clocks, watches and daily habits were tied to the 24-hour day. Some surviving watches carry both dials.
- **An older decimal day [R].** Imperial China divided the day into 100 *ke* for much of its history. One ke is 14.4 minutes, so 10 metric minutes equal one ke.
- **Why it never took hold.** 24 divides evenly by 2, 3, 4, 6, 8 and 12, which makes "quarter of a day" and "a third of a day" easy; 10 divides only by 2 and 5. A decimal day fits calculation better and civil life worse. Astronomers do use decimal days (the Julian date and fractions of a day).
- **Daylight saving time.** The clock measures real milliseconds since local midnight. On the 23-hour spring-forward day it therefore reaches only about 9:58 before wrapping to 0:00, and on the 25-hour fall-back day the hour display can read 10 past the last numeral on the dial.

## Notes for readers

This is an independent personal project, provided for education and curiosity only. The facts marked **[R]** are recalled from memory; check them against a primary source before quoting them.

## License

Documentation in this folder: [PolyForm Noncommercial License 1.0.0](../LICENSE), Copyright (c) 2026 Post Millennium Renaissance. The clock itself lives in its own repository and carries its own notice.
