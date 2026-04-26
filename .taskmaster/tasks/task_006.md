# Task ID: 6

**Title:** Add Feature Gating to Existing Services

**Status:** pending

**Dependencies:** 5

**Priority:** medium

**Description:** Enforce plan limits in room, note, transcription, and focus tracker services by checking user.subscriptionTier

**Details:**

Pattern for each service: import PLAN_LIMITS from subscription/plan-limits.const. Get user from repo. Check user.subscriptionTier. Compare against limit.

1. d:/FYP/merge-backend/src/room/room.service.ts: In create() method, after fetching user, count existing rooms: const roomCount = await this.roomRepo.count({ where: { creator: { id: userId } } }); if (roomCount >= PLAN_LIMITS[user.subscriptionTier].roomLimit) throw new ForbiddenException('Room limit reached. Please upgrade your plan.');

2. d:/FYP/merge-backend/src/note/note.service.ts: In create() method, count user's notes. If noteLimit !== -1 and count >= limit, throw ForbiddenException.

3. d:/FYP/merge-backend/src/transcription/transcription.service.ts: At the start of the main transcription trigger method, check PLAN_LIMITS[user.subscriptionTier].hasLectureSummary. If false, throw ForbiddenException('Lecture summary requires Pro or Max plan.').

4. Focus tracker: Find the relevant service/controller for focus tracker and add hasFocusTracker check similarly.

**Test Strategy:**

Test with a free user account: try creating 3rd room → should get 403. Try using transcription on free plan → should get 403.
