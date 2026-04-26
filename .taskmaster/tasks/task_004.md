# Task ID: 4

**Title:** Hook Rewards into Calendar Task Completion

**Status:** pending

**Dependencies:** 3

**Priority:** high

**Description:** Modify CalendarService.updateStatus() to trigger RewardsService.onTaskCompleted() when a task is marked completed

**Details:**

In d:/FYP/merge-backend/src/calendar/calendar.service.ts:
- Inject RewardsService in constructor
- In updateStatus() method, after saving the event: if (dto.status === TaskStatus.COMPLETED) { try { await this.rewardsService.onTaskCompleted(userId, new Date()); } catch (e) { this.logger.error('Rewards tracking failed', e); } }

In d:/FYP/merge-backend/src/calendar/calendar.module.ts:
- Import RewardsModule. Since CalendarModule is already imported in AppModule and RewardsModule will also be there, use forwardRef if circular dependency occurs: imports: [forwardRef(() => RewardsModule)]

**Test Strategy:**

Mark a task as completed via API. Check that UserStreak and UserChallengeProgress records are created/updated in the DB.
