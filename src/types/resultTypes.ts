type MatchingAnalysis = {
    project_name: string,
    highest_matched_with: string,
    copy_probability: string,
    html_similarity: number,
    css_similarity: number,
    weighted_avg_similarity: number,
    js_similarity: 4
}

type AuthorInfo = {
    repo_owner:string,
    repo_owner_email:string
}

type CommitInfo = {
    commit_time: Date,
    commit_message:string
}

type RepoInfo = {
    author_info: AuthorInfo,
    latest_commits: [CommitInfo]
}

type DuplicationResult = {
    highest_match : MatchingAnalysis,
    repo_info: RepoInfo

} 

export { DuplicationResult }