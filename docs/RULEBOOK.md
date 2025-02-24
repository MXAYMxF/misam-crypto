# Project Constitution

## Development Philosophy

### Documentation as Code
Documentation is not an afterthought - it is a crucial part of our development process, equal in importance to the code itself. Our development practice integrates:

1. **Continuous Documentation**
   - Every decision is documented
   - Every conversation is archived
   - Every issue is tracked
   - Every test is planned before implementation
   - Every code is commented as part of in-code documentation and well organized in terms of input/output expectations 

2. **Knowledge Management**
   - HISTORY.md captures our journey and decisions
   - JOURNAL.md tracks our daily progress
   - RULEBOOK.md maintains our standards
   - TESTS.md plans our quality assurance
   - ROADMAP.md guides our direction
   - ISSUES.md preserves our problem-solving
   - REQUIREMENTS.md defines our goals

3. **Maturity Indicators**
   - Documentation completeness and instant updates
   - Test coverage metrics
   - Issue resolution patterns
   - Development process adherence
   - Knowledge base growth

### Why This Matters
- Builds institutional knowledge
- Ensures project continuity
- Enables better collaboration
- Prevents knowledge loss
- Makes the codebase maintainable
- Creates learning opportunities
- Improves decision-making

## Session Workflow
1. **Begin Every Session**
   - Review JOURNAL.md last entry
   - Review HISTORY.MD to understand previous context
   - Review ROADMAP.md for current progress
   - Update ROADMAP.md before new features
   - Create feature branch following naming convention

2. **During Session**
   - Update HISTORY.MD after EACH significant conversation
   - Record:
     - User questions and concerns
     - Important decisions made
     - Solutions proposed and implemented
     - Changes in project direction
     - Learning moments and insights
   - Commit history updates with [HISTORY] tag
   - This helps combat:
     - Long conversation loss
     - AI forgetfulness
     - Context fragmentation
     - Overconfidence in memory

2. **Branch Management**
   ```bash
   # Pattern:  
   git checkout -b docs/[feature]-[date]  
   # Example:  
   git checkout -b docs/asset-context-20240315
   ```

3. **Documentation Updates**
   - Every feature starts with test cases in `/docs/TESTS.md`
   - Journal updates required after:
     - 2 hours of work
     - Feature completion
   - File all errors in ISSUES.md using triage format

4. **Commit Standards**
   ```bash
   # Must reference updated docs
   git commit -m "feat: Add portfolio context [JOURNAL][TESTS]"
   ```

## Technical Requirements

1. **Architecture**
   - Context API structure (see REQUIREMENTS.md)
   - Follow component hierarchy defined in project structure

2. **Security**
   - All storage calls encrypted via AES-256
   - Secure API communication
   - Environment variables for sensitive data

3. **Testing**
   - 80% test coverage minimum
   - All new features require tests
   - Run full test suite before PR

## Pull Request Rules

1. **Never push to `main` directly**
2. **PR Requirements**
   - Passing tests
   - Updated roadmap
   - Journal entry
   - Code review approval
   - Updated documentation

## Quality Standards

1. **Code Quality**
   - TypeScript strict mode
   - ESLint compliance
   - Prettier formatting

2. **Performance**
   - Optimize bundle size
   - Monitor render cycles
   - Efficient state updates

3. **Documentation**
   - Clear component documentation
   - Updated changelog
   - Maintained type definitions
