# v3.5 Verification Checklist

## Testing Requirements

### Unit Tests
- [ ] `lib/validations/checkout.ts` - Delivery fee calculations (per location + quantity matrix)
- [ ] `lib/validations/cms.ts` - Product schema with designer fee field
- [ ] `lib/validations/auth.ts` - Account deletion validation and confirmation
- [ ] Payment failure scenarios and retry logic

### Integration Tests
- [ ] Per-location delivery fee calculation (Addis Ababa sub-city structure)
- [ ] Quantity-based delivery cost matrix (larger orders)
- [ ] Order summary displays production assets/file uploads correctly
- [ ] Designer service fee applied in cart and checkout
- [ ] Real-time message portal (user ↔ admin)
- [ ] Full auth flow (login, signup, account recovery, deletion)
- [ ] Chapa hosted checkout receipt display fix
- [ ] Order pending status save on payment failure
- [ ] Email notification on failed payment

### UI/UX Tests
- [ ] Order status tracker displays all states correctly
- [ ] Design assets shown in order confirmation page
- [ ] Delivery fees calculated and displayed per sub-city
- [ ] Designer service fee visible in product detail
- [ ] Messages portal UI functional with real-time updates
- [ ] Mac Chrome performance acceptable (no lag)

### Cross-Browser Testing
- [ ] Chrome (Windows, Mac, Linux)
- [ ] Firefox (all platforms)
- [ ] Safari (Mac, iOS)
- [ ] Edge (Windows, Mac)

### Performance Testing
- [ ] Lighthouse score > 90 on Mac Chrome
- [ ] Bundle size analysis (target < 200KB gzipped)
- [ ] Image optimization verification
- [ ] Animation performance profiling (framer-motion)
- [ ] Memory leak detection

## Implementation Verification

### Requirement 1: Per Location Delivery Charges
- [ ] Geo calculation implemented for Addis Ababa sub-cities
- [ ] Delivery fees vary by sub-city structure
- [ ] Integration with cart total calculation
- [ ] Display in checkout and order summary

### Requirement 2: Price and Quantity Matrix
- [ ] Delivery cost matrix for larger orders implemented
- [ ] Quantity brackets defined (1-5, 6-10, 11-20, 20+)
- [ ] Matrix pricing applied automatically
- [ ] Display in cart and checkout

### Requirement 3: Order Status Flow
- [ ] Status flow: Order Confirmed → Design Under Review → On Hold → Approved → Printing → Ready → Out for Delivery → Delivered
- [ ] Visual status tracker in UI
- [ ] Status transitions respected in UI
- [ ] Admin interface for status updates

### Requirement 4: Order Summary with Production Assets
- [ ] File uploads displayed in order summary
- [ ] Design assets linked to order items
- [ ] Download URLs and file info shown
- [ ] Thumbnails for image files

### Requirement 5: Designer Service Fee (CMS Configurable)
- [ ] `hireDesignerFee` field in product form schema
- [ ] Fee applied when designer service selected
- [ ] Displayed in product detail
- [ ] Included in cart total

### Requirement 6: Communication Portal
- [ ] Message portal UI built
- [ ] Real-time updates (Supabase subscriptions)
- [ ] User can send messages to admin
- [ ] Admin can respond
- [ ] Messages associated with specific orders

### Requirement 7: Full Auth
- [ ] Login functionality working
- [ ] Signup functionality working
- [ ] Account recovery (forgot password) working
- [ ] Account deletion implemented
- [ ] Email confirmation for sensitive actions

### Requirement 8: Chapa Receipt Display Fix
- [ ] Receipt data retrieved correctly from Chapa
- [ ] Order confirmation displays payment details
- [ ] Transaction status shown
- [ ] No display issues on receipt page

### Requirement 9: Mac Chrome Performance
- [ ] Performance issues investigated
- [ ] Root cause identified
- [ ] Fixes implemented
- [ ] Lighthouse score improved
- [ ] Bundle size optimized

### Requirement 10: Pending Order Status
- [ ] Failed payments save order as pending
- [ ] Email notification sent to user
- [ ] User can retry payment from account
- [ ] Order status shows payment_pending

## Code Quality Checks

### TypeScript
- [ ] No type errors (`tsc --noEmit`)
- [ ] Strict mode enabled
- [ ] Proper interfaces for all data models
- [ ] Type-safe database queries

### Code Style
- [ ] ESLint passes without errors
- [ ] Prettier formatting consistent
- [ ] No console.log in production code
- [ ] Proper error handling

### Security
- [ ] No secrets in code
- [ ] Environment variables used for sensitive data
- [ ] Auth guards implemented
- [ ] RLS policies enforced

## Testing Coverage

### Unit Test Coverage
- [ ] Validation schemas tested
- [ ] Auth functions tested
- [ ] Cart logic tested
- [ ] Database queries tested

### Integration Test Coverage
- [ ] End-to-end checkout flow
- [ ] File upload workflow
- [ ] Messaging functionality
- [ ] Payment integration
- [ ] Admin workflows

## Documentation

### Code Documentation
- [ ] Function comments for complex logic
- [ ] API documentation updated
- [ ] Component props documented

### User Documentation
- [ ] Checkout flow documented
- [ ] Order status guide
- [ ] FAQ for common issues

## Final Acceptance Criteria

### All Requirements Met
- [ ] All 10 requirements implemented
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable

### Stakeholder Review
- [ ] Product owner approval
- [ ] QA sign-off
- [ ] Design review completed

### Production Ready
- [ ] Deployed to staging
- [ ] Smoke tests pass
- [ ] Monitoring configured
- [ ] Rollback plan ready