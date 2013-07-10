function UserInfo() {
    
    var displayName = prompt('Enter your name:', '') || 'Anonymous';

    return {
        displayName: displayName
    };
}