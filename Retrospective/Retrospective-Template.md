TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done
    - Committed stories: 3
    - Done stories: 0
- Total points committed vs. done
    - Committed points: 55
    - Done points: 0
- Nr of hours planned vs. spent (as a team)
    - Planned hours: 66h 10m
    - Spent hours: 74h

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing:
    - 7
- Code review completed:
    - 27 tasks
- Code present on VCS:
    - 84 commits
- End-to-End tests performed:
    - 38

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 10      | -      | 2d 1h 20m  | 2d 5h        |
| _#1_   | 13      | 21     | 2d 3h 20m  | 2d 1h 41m    |
| _#2_   |  9      | 13     | 1d 7h      | 1d 6h 37m    |
| _#3_   |  8      | 21     | 1d 6h 30m  | 1d 7h 30m    |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
    - Hours task avg:
        - Estimated: 1.65 hr
        - Actual 1.75 h
    - Std dev:
        - Estimate: 110.17
        - Actual: 133.88
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$:
    
    - 0.03787
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    - 0.5342
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated:
    - 2h
  - Total hours spent.
    - 2h
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated:
    - 5h 30m
  - Total hours spent:
    - 7h 30m
- Code review 
  - Total hours estimated: 5h
  - Total hours spent: 5h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - A few decisions regarding project structure and technologies were changed after the initial planning stage.
  - The team's Git proficiency has been a limiting factor: resolving conflicts, merging changes, and the consequences of general lack of confidence with the tool took up a fraction of development time.

- What lessons did you learn (both positive and negative) in this sprint?
  - Open communication is necessary. Different team members may have different views on how to handle problems, so agreeing on a common solution as early as possible will make development easier, when communication was not clear, development slowed down.
  - Sharing knowledge is important: different team members have showed to have different levels of proficiency with the employed tools, asking for advice has usually helped. However knowledge and decisions were primarly shared by word, having them stored in a written form will definitely help speed up the developmen process for the next sprint.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - This being the first retrospective, there are no previous goals that needed to be met explicitly, however:
    - Learning to subdivide work in small tasks
    - Managing time
    - Coordinating with each other
    - Openly communicating about issues and ideas
  And having a first hands-on approach with Agile development in general can be considered as valuable improvements from the perspective of software engineers.
  
- Which ones you were not able to achieve? Why?
  - No previous explicit goals were set since this is the first retrospective, however, as stated above:
    - Knowledge sharing could be improved

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - A single team member may assign themselves a group of tasks that are dependent from each other but fairly independent from other parts of the system, so that every membre needs to wait as little as possible for other members to finish their work.
  - Improving Git proficiency is needed as it showed to be a bottleneck for the performance of the team, reviewing the basic documentation will let everyone keep up with the development flow.

- One thing you are proud of as a Team!!
  - Despite the challenges, the team mantained a very positive attitude, we created a stress-free atmoshpere where everyone felt comfortable tackling tasks.
