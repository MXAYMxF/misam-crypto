# Project Constitution

## Session Workflow
1. **Begin Every Session**
   - Review JOURNAL.md last entry
   - Update ROADMAP.md before new features
   - Create feature branch following naming convention

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
