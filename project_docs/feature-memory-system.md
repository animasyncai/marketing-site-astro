Memory System Documentation

## Current MVP Implementation

### Summary-Only Approach

- **What**: Single evolving summary that grows with conversation
- **When**: Updates every 5 messages
- **Length**: Unlimited (starts ~150 words, grows to 400-500+)
- **Purpose**: Maintains both emotional arc AND specific memories
- **Location**: `/prompts/summarizeAndExtract.md` (simplified version)

### Technical Details

- Working memory: 10 most recent messages
- Summary captures everything older than 10 messages
- No separate significant_notes for users in MVP
- Admin view includes significant_notes for testing

### Why This Approach

- Cost-effective for MVP
- Single system to maintain
- Preserves important details through unlimited growth
- Natural scaling with conversation depth

## Post-MVP Roadmap

### Phase 2: Significant Notes

- [ ] Enable significant_notes for all users
- [ ] Separate persistent memory layer
- [ ] 3-5 key memories per conversation
- [ ] Search/retrieval capabilities

### Phase 3: Advanced Memory

- [ ] Conversation trajectory tracking
- [ ] Cross-session memory linking
- [ ] Pattern recognition across conversations
- [ ] Memory visualization for users

## See Also

- `/prompts/summarizeAndExtract.md` - Current implementation
- `/backlog.md` - Future memory enhancements
