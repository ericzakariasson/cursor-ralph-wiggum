#!/bin/bash
# Ralph afterStop hook - checks if we should continue iterating

TESTS_FILE=".agent/tests.json"

# Check if tests file exists
if [[ ! -f "$TESTS_FILE" ]]; then
  # No tests file yet, let agent continue to create it
  exit 0
fi

# Read the tests file
tests_json=$(cat "$TESTS_FILE" 2>/dev/null)

if [[ -z "$tests_json" ]]; then
  exit 0
fi

# Extract iteration and maxIterations
iteration=$(echo "$tests_json" | grep -o '"iteration"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$')
max_iterations=$(echo "$tests_json" | grep -o '"maxIterations"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$')

# Default values if not found
iteration=${iteration:-0}
max_iterations=${max_iterations:-10}

# Check if we've hit max iterations
if [[ "$iteration" -ge "$max_iterations" ]]; then
  echo "Max iterations ($max_iterations) reached. Stopping." >&2
  exit 0
fi

# Count total tests and passed tests
total_tests=$(echo "$tests_json" | grep -o '"passed"' | wc -l | tr -d ' ')
passed_tests=$(echo "$tests_json" | grep -o '"passed"[[:space:]]*:[[:space:]]*true' | wc -l | tr -d ' ')

# If all tests pass, we're done
if [[ "$passed_tests" -eq "$total_tests" ]] && [[ "$total_tests" -gt 0 ]]; then
  echo "All $total_tests tests passed! Ralph complete." >&2
  exit 0
fi

# Tests still failing - continue the loop
remaining=$((total_tests - passed_tests))

cat << EOF
{
  "followup_message": "Ralph iteration $iteration complete. $passed_tests of $total_tests tests passing, $remaining remaining. Continue implementing and verifying tests. Update .agent/tests.json as tests pass."
}
EOF
