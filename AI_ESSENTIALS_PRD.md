# AI Essentials Monolithic Course Restructuring
## Product Requirements Document (PRD)

### 📋 Document Information
- **Version:** 1.0
- **Date:** February 18, 2026
- **Author:** Cascade AI Assistant
- **Stakeholders:** FutureLabs Academy Team
- **Status:** Approved for Implementation

---

## 🎯 Executive Summary

**Problem:** FutureLabs Academy currently offers separate weekly courses (Week 1, Week 2, etc.), creating a fragmented learning experience and complex enrollment management.

**Solution:** Restructure into a single monolithic "AI Essentials" course containing Weeks 1-6 as internal sections, providing a cohesive learning journey with progressive access control.

**Impact:** Improved user experience, simplified course management, better content organization, and clearer progression path for AI learning.

---

## 📊 Current State Analysis

### Existing Course Structure
- **Week 1: "AI Essentials for Digital Success"** - 6 lessons
- **Week 2: "AI Tools & Content Generation"** - 6 lessons (separate course)
- **Multiple separate courses** with independent enrollment
- **Fragmented user experience** across different course pages

### Pain Points Identified
- Users must enroll in multiple separate courses
- No clear progression between weeks
- Complex enrollment and payment management
- Inconsistent access control logic
- Poor course discovery experience

---

## 🎯 Objectives & Success Metrics

### Primary Objectives
1. **Unified Learning Experience** - Single course containing all 6 weeks
2. **Progressive Access Control** - Week 1 free, others unlock via enrollment/completion
3. **Improved User Flow** - Seamless navigation between weeks within one course
4. **Simplified Management** - One course to manage instead of multiple

### Success Metrics
- **User Engagement:** 40% increase in course completion rate
- **Enrollment Rate:** 25% increase in paid enrollments
- **User Satisfaction:** 4.5+ star rating for course structure
- **Technical Performance:** 99.9% uptime, <2s page load times

---

## 👥 User Stories

### Student Perspective
```
As a student,
I want to enroll in one comprehensive AI course
So that I can have a clear learning path from basics to advanced topics
Without having to manage multiple separate enrollments
```

```
As a student,
I want Week 1 to be free
So that I can try the course before committing to payment
And unlock subsequent weeks through completion or enrollment
```

```
As a student,
I want to navigate seamlessly between weeks within one course
So that I can easily move between different parts of my learning journey
Without losing my place or having to search for different courses
```

### Administrator Perspective
```
As an administrator,
I want to manage one course instead of multiple separate courses
So that I can easily update content and track student progress
Without dealing with complex cross-course dependencies
```

```
As an administrator,
I want clear enrollment analytics for the entire course
So that I can understand overall student engagement and completion rates
Across all weeks of the AI learning journey
```

---

## 📋 Detailed Requirements

### 1. Course Structure Requirements

#### 1.1 Monolithic Course Architecture
- **REQ-001:** Create single "AI Essentials" course containing Weeks 1-6
- **REQ-002:** Weeks 1-6 must exist as internal sections within one course
- **REQ-003:** Each week must contain exactly 6 lessons (36 total lessons)
- **REQ-004:** Course price: ₦50,000 (NGN) for complete access

#### 1.2 Content Organization
- **REQ-005:** Week 1: AI Fundamentals & Core Concepts (always free)
- **REQ-006:** Week 2: AI Content Creation & Management (moved from separate course)
- **REQ-007:** Week 3: Advanced Content Strategies
- **REQ-008:** Week 4: AI Image Generation
- **REQ-009:** Week 5: Quality Control & Systems
- **REQ-010:** Week 6: Advanced Implementation

### 2. Access Control Requirements

#### 2.1 Progressive Unlocking Logic
- **REQ-011:** Week 1 must always be accessible (no enrollment required)
- **REQ-012:** Week 2+ requires either enrollment OR completion of previous week
- **REQ-013:** Enrolled users get immediate access to all weeks
- **REQ-014:** Non-enrolled users can progress week-by-week through completion

#### 2.2 Enrollment Management
- **REQ-015:** Single enrollment covers entire 6-week course
- **REQ-016:** Payment integration with Paystack (₦50,000)
- **REQ-017:** Enrollment status applies to entire monolithic course
- **REQ-018:** Maintain existing payment validation logic

### 3. User Interface Requirements

#### 3.1 Homepage/Curriculum Display
- **REQ-019:** Display single "AI Essentials" course card
- **REQ-020:** Show week breakdown within course preview
- **REQ-021:** Clear pricing and enrollment CTA
- **REQ-022:** Progress indicators for enrolled users

#### 3.2 Course Detail Page
- **REQ-023:** Week navigation tabs (Week 1, Week 2, Week 3, etc.)
- **REQ-024:** Active week highlighting
- **REQ-025:** Lesson sidebar showing current week's lessons
- **REQ-026:** Lock/unlock indicators for restricted weeks
- **REQ-027:** Quiz access after Week 6 completion

#### 3.3 Navigation & UX
- **REQ-028:** Seamless week-to-week navigation
- **REQ-029:** Breadcrumb showing "AI Essentials > Week X"
- **REQ-030:** Progress tracking across entire course
- **REQ-031:** Mobile-responsive week navigation

### 4. Technical Requirements

#### 4.1 Database Schema Changes
- **REQ-032:** Maintain single `courses` table with one published record
- **REQ-033:** Update `lessons` table with proper `sort_order` (1-36)
- **REQ-034:** Single enrollment record per user for entire course
- **REQ-035:** Lesson progress tracking across all weeks

#### 4.2 Backend Logic Updates
- **REQ-036:** Week calculation: `week = ceil(sort_order / 6)`
- **REQ-037:** Access control logic based on enrollment + completion
- **REQ-038:** Progress aggregation across entire course
- **REQ-039:** Maintain existing payment processing

#### 4.3 Frontend Component Updates
- **REQ-040:** Update Curriculum component for monolithic display
- **REQ-041:** Update CourseDetail component with week navigation
- **REQ-042:** Update access control logic throughout app
- **REQ-043:** Maintain existing enrollment and payment flows

---

## 🏗️ Technical Specifications

### Database Schema Updates

#### Courses Table
```sql
-- Single published course
INSERT INTO courses (title, description, is_published, price, currency)
VALUES ('AI Essentials', 'Complete AI learning journey...', true, 50000, 'NGN');
```

#### Lessons Table Organization
```sql
-- Lessons organized by sort_order (1-36)
-- Week 1: sort_order 1-6
-- Week 2: sort_order 7-12
-- Week 3: sort_order 13-18
-- Week 4: sort_order 19-24
-- Week 5: sort_order 25-30
-- Week 6: sort_order 31-36
```

#### Access Control Logic
```typescript
const canAccessWeek = (weekNumber: number, isEnrolled: boolean, completedWeeks: number[]) => {
  if (weekNumber === 1) return true; // Week 1 always free
  if (isEnrolled) return true; // Enrolled users get all access
  return completedWeeks.includes(weekNumber - 1); // Previous week completed
};
```

### Frontend Component Structure

#### Curriculum Component
- Display single course card
- Show week breakdown preview
- Handle enrollment CTA

#### CourseDetail Component
- Week navigation tabs
- Lesson sidebar per week
- Progress tracking
- Quiz integration

#### Access Control Components
- Protected week access
- Enrollment prompts
- Progress indicators

---

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] Single "AI Essentials" course visible on homepage
- [ ] Weeks 1-6 accessible as internal sections
- [ ] Week 1 always free, others require enrollment/completion
- [ ] Seamless navigation between weeks
- [ ] Single enrollment covers entire course
- [ ] Payment processing works correctly
- [ ] Progress tracking across all weeks
- [ ] Quiz available after Week 6 completion

### Technical Requirements
- [ ] Database schema properly restructured
- [ ] All existing enrollments migrated
- [ ] Local development environment working
- [ ] Production deployment successful
- [ ] No broken links or missing content
- [ ] Mobile responsive design maintained

### User Experience Requirements
- [ ] Clear course structure and pricing
- [ ] Intuitive week navigation
- [ ] Proper loading states and error handling
- [ ] Consistent design with existing platform
- [ ] Accessible for all user types

---

## 📅 Implementation Timeline

### Phase 1: Database Restructuring (Week 1)
- Database schema updates
- Content migration and organization
- Enrollment data migration
- Local testing verification

### Phase 2: Frontend Updates (Week 1-2)
- Curriculum component updates
- CourseDetail component restructuring
- Access control logic implementation
- UI/UX refinements

### Phase 3: Testing & Deployment (Week 2)
- Comprehensive testing (local + staging)
- User acceptance testing
- Production deployment
- Post-deployment monitoring

### Phase 4: Optimization (Week 3)
- Performance optimization
- Analytics implementation
- User feedback collection
- Iterative improvements

---

## 🔍 Risk Assessment & Mitigation

### High Risk Items
1. **Data Migration Failure**
   - **Risk:** Loss of enrollment or progress data
   - **Mitigation:** Full database backup, phased migration, rollback plan

2. **User Experience Disruption**
   - **Risk:** Confusing navigation or broken access control
   - **Mitigation:** Thorough testing, gradual rollout, user feedback loops

3. **Payment Integration Issues**
   - **Risk:** Broken enrollment/payment flow
   - **Mitigation:** Existing payment logic preservation, comprehensive testing

### Medium Risk Items
1. **Content Organization**
2. **Mobile Responsiveness**
3. **Performance Impact**

---

## 📊 Success Metrics & KPIs

### User Engagement Metrics
- Course completion rate (target: 40% increase)
- Average session duration per week
- Week-to-week progression rate
- Quiz completion and pass rates

### Business Metrics
- Enrollment conversion rate (target: 25% increase)
- Average revenue per student
- Course satisfaction ratings
- Retention rate across weeks

### Technical Metrics
- Page load times (<2 seconds)
- Error rates (<0.1%)
- Database query performance
- Mobile usage analytics

---

## 🎯 Next Steps

1. **Immediate Actions:**
   - Finalize database restructuring
   - Complete frontend component updates
   - Conduct thorough testing

2. **Short-term Goals (2 weeks):**
   - Successful production deployment
   - User feedback collection
   - Performance monitoring

3. **Long-term Vision:**
   - Expand to additional AI courses
   - Implement advanced learning analytics
   - Mobile app development
   - Integration with learning management systems

---

## 📞 Support & Communication

### Stakeholders
- **Product Owner:** FutureLabs Academy Team
- **Technical Lead:** Development Team
- **QA Lead:** Testing Team
- **Design Lead:** UX/UI Team

### Communication Plan
- **Daily Standups:** Technical progress updates
- **Weekly Reviews:** Stakeholder alignment meetings
- **User Testing:** Feedback collection sessions
- **Deployment Notifications:** Team and user communications

---

*This PRD will be updated as implementation progresses and new requirements emerge.*
