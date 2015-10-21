#missing colon
file { '/foo'
  ensure => file,
  mode   => '1777',
}

#missing comma
user { 'bar':
  ensure => present
  uid    => 006,
}

#typo attribute
group { 'baz':
  esure => absent,
  gid   => 007,
}

#ensure compatible with linter-puppet-lint
exec { 'make me a pizza':
  command  => '/bin/mkpizza',
  onlyif   => '/bin/ls /hungry',
}
